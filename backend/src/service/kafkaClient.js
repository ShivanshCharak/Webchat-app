import { Kafka } from 'kafkajs';
import Message from '../models/message.models.js'

let producer = null;
const kafka = new Kafka({
  clientId: "messages",
  brokers: ['192.168.1.10:9092']
});

export async function createProducer() {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "messages"
  });
}

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: 'default' });
  await consumer.connect();
  await consumer.subscribe({ topic: "messages", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message, pause }) => {
      console.log(message.value.toString());
      try {
        const newMessage = new Message({ message: message.value.toString() });
        await newMessage.save();
      } catch (error) {
        console.error("Error processing message", error);
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "messages" }]);
        }, 60 * 1000);
      }
    },
  });
  console.log("Kafka client successfully running");
  return consumer;
}
