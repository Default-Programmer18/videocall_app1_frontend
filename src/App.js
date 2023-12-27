
import "./App.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/Context";
import ReactPlayer from 'react-player'
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaMicrophoneAltSlash } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import { IoVideocamOff } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { MdWifiCalling } from "react-icons/md";
import { FcEndCall } from "react-icons/fc";
import { MdOutlineScreenShare } from "react-icons/md";
import { MdOutlineStopScreenShare } from "react-icons/md";

import "./index.css";
import CopyToClipboard from "react-copy-to-clipboard";
function App() {
  const {
    myid,myVideo,userVideo,callAccepted,callEnded,stream,idToCall,setIdToCall,
      answercall,calluser,call,leaveCall,ustream,name,setName,videoShown, handlevideo,handleaudio,audioShown,
    calling,callrejected,setCallrejected,setCalling,rejectCall

  } = useContext(UserContext);
  

  // grid w-10/12 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4
  return (
    <div className="flex flex-col items-center justify-center font-edu-sa gap-5 h-full w-full bg-black">
      <div className="flex default:flex-row sm:flex-col gap-5">
        {stream && (
          <div className="flex flex-col gap-3  items-center bg-blue-700 py-2 w-[580px] h-auto rounded-md">
            <h5 className="text-2xl font-semibold font-edu-sa text-yellow-50">
              {name||"Name"}
            </h5>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={"w-[90%] h-auto"}
            />

            <div>
              {videoShown && <button  className="rounded-full text-2xl bg-white  m-5 p-4"  onClick={handlevideo}><IoVideocam
             /></button>
              }
              {
                !videoShown && <button  className="rounded-full text-2xl bg-white m-5 p-4"   onClick={handlevideo}>
                <IoVideocamOff/></button>
              }
              {
                audioShown &&<button  className="rounded-full text-2xl bg-white m-5 p-4"  onClick={handleaudio}><FaMicrophoneAlt />
                 </button>
              }
              {
                !audioShown && <button  className="rounded-full text-2xl bg-white m-5 p-4"  onClick={handleaudio}><FaMicrophoneAltSlash>

                </FaMicrophoneAltSlash></button>
              }
              {/* {
                videoShown&& shareScreen && <button  className="rounded-full text-2xl bg-white m-5 p-4"  onClick={handleshareScreen}>
                 <MdOutlineScreenShare></MdOutlineScreenShare></button>
              }
              {
                !shareScreen && <button  className="rounded-full text-2xl bg-white m-5 p-4"  onClick={handleshareScreen}>
                 <MdOutlineStopScreenShare></MdOutlineStopScreenShare></button>
              } */}

            </div>
          </div>
        )}
        {callAccepted && !callEnded && (
          <div className="flex flex-col gap-3  items-center bg-blue-700 py-2 w-[580px] rounded-md">
            <h5 className="text-2xl font-semibold font-inter text-yellow-50 ">
              { call.name||"Name"}
            </h5>
            <ReactPlayer playing muted height={"auto"} width={"90%"} url={ustream}></ReactPlayer>
        
          </div>
        )}
      </div>
      <CopyToClipboard text={myid}>
        <button className="bg-yellow-50 p-3 text-richblue-500 rounded-md font-semibold ">Copy Your ID</button>
      </CopyToClipboard>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
       

          <label htmlFor="name" className="text-richblue-500 rounded-md  bg-yellow-50 p-2  mr-2 font-semibold">Name:</label>
            <input
            className="rounded-md"
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                
              }}
            />  <br/><br/>

            
          
          <label htmlFor="id"> </label>
            <input
                className="rounded-md"
              type="text"
              name="id"
              value={idToCall}
              onChange={(e) => {
                setIdToCall(e.target.value);
              }}
            />
            
            {callAccepted && !callEnded ? (
            <button onClick={leaveCall} className="bg-yellow-50 p-3 rounded-md ml-2 text-richblue-500 font-semibold">
            <p className="inline-flex  "> Hang Up<FcEndCall className=" ml-1 text-[20px] self-center" /></p>
            </button>
          ) :idToCall.length>0 ?(
            <button
              className="bg-yellow-50 p-3 rounded-md text-richblue-500 font-semibold ml-2"
              onClick={() => calluser(idToCall)}
            >
             <p className="inline-flex  "> Call  <IoCall className=" ml-1 text-[20px] self-center" /></p>
            </button>):(
            <button
              className="bg-yellow-50 p-3 rounded-md text-richblue-500 font-semibold ml-2" disabled
             
            >
             <p className="inline-flex  "> Call  <IoCall className=" ml-1 text-[20px] self-center" /></p>
            </button>)
          }
         

          
        </form>
      </div>
      {calling && !callAccepted  &&(
        <div style={{ display: "flex"  }}>
          <h1 className="inline-flex  text-caribbeangreen-200 font-semibold  text-2xl m-5 animate-pulse">  Calling Someone...
          
          <MdWifiCalling  className="  ml-1 text-[40px] self-center"/></h1>
         
        </div>
      )}
      {callrejected && !callAccepted && (
     
          <h1 className="inline-flex  text-red-500 font-semibold  text-2xl m-5">  Call Rejected!
          
          <MdWifiCalling  className="  ml-1 text-[40px] self-center"/></h1>
        
        
      )}
      {callEnded &&( <h1 className="inline-flex  text-red-500 font-semibold  text-2xl m-5">  Call Ended!</h1>)}
    

      {call.incomingcall && !callAccepted &&  (
        <div style={{ display: "flex", marginTop:"5px" }}>
          <h1 className="inline-flex d text-red-500 font-semibold  text-lg m-5"> {call.name||"Someone"} is calling:</h1>
          <button className="bg-caribbeangreen-200 rounded-md px-2 mx-2 animate-bounce " onClick={answercall}>
          <p className="inline-flex font-semibold  text-white ">  Answer<MdWifiCalling  className="  ml-1 text-[25px] self-center"/></p>
          </button>
          <button className="bg-red-500 rounded-md px-2  animate-bounce font-semibold  text-white" onClick={rejectCall}>
            Reject 
          </button>
        </div>
      )}
      
      
    </div>
  );
}

export default App;