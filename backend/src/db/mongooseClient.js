import mongoose from "mongoose";
export async function mongooseClient(){
  try {
    const connection = await mongoose.connect(
      "mongodb://localhost:27017/chatApp"
    );
    console.log("Connected to ", connection.connection.name);
  } catch (error) {
    console.log(error.message)
  }
}
