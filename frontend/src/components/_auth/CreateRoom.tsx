import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
  const nav = useNavigate()
  const [generatedRoomNumber, setGeneratedRoomNumber] = useState("");

  function generateRoomNumber() {
    const stringPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 15; i++) {
      result += stringPool.charAt(Math.floor(Math.random() * stringPool.length));
    }
    setGeneratedRoomNumber(result);
  }

  function copyToClipboard() {
    // Create a temporary textarea element
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = generatedRoomNumber;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999); 
    document.execCommand('copy');

    document.body.removeChild(tempTextArea);
  }

  return (
    <div className='w-[600px] mx-auto my-[15%]'>
      <div className='font-black text-5xl'>Create String for Room</div>
      <div
        className='bg-[#222E35] rounded-lg w-[500px] py-[14px] px-[24px] font-mono mb-[20px] mt-[20px] h-[50px]'
        onClick={copyToClipboard} // Attach the copyToClipboard function to the onClick event
        style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickable
      >
        {generatedRoomNumber === "" ? "Generate Your String Now" : generatedRoomNumber} <span></span>
      </div>
      <div className='flex justify-between w-[500px]'>
        <button
          className='bg-[#222E35] rounded-lg py-[14px] px-[24px] font-mono w-[300px]'
          onClick={generateRoomNumber}
          aria-label="Generate Room Number"
        >
          Generate String
        </button>
        <button
          className='bg-[#44a13c] rounded-lg py-[14px] px-[24px] font-mono'
          aria-label="Go back"
          onClick={()=>{nav("/")}}
        >
          Go back
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;
