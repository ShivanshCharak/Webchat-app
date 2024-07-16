import { Routes,Route } from "react-router-dom"
import Home from "./components/_auth/Home"
import ChatRoom from "./components/_auth/ChatRoom"
import CreateRoom from "./components/_auth/CreateRoom"
import VideoChat from "./components/_auth/VideoChat"
function App() {
  return (
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/chatRoom" element={<ChatRoom/>}/>
    <Route path="/create-room" element={<CreateRoom/>}/>
    <Route path="/video-call" element={<VideoChat/>}/>
   </Routes>
  )
}

export default App
