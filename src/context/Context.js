import {  createContext, useCallback, useEffect, useRef, useState } from "react";
import Peer from "../peer_service/Peer";
import {io} from "socket.io-client"

export const UserContext = createContext()

const socket=io("http://localhost:8000")

export  const ContextProvider=({children})=>{

    const [myid,setMyid]=useState("");
    const [call,setCall]=useState({});
    const [callAccepted,setCallAccepted]=useState(false);
    const [callEnded,setcallEnded]=useState(false);
    const [idToCall,setIdToCall]=useState("");
    const [stream,setStream]=useState();
    const [ustream,setUStream]=useState();
    const[name,setName]=useState("");
    const[videoShown,setVideoShown]=useState(true);
    const[audioShown,setAudioShown]=useState(true);
    const[callrejected,setCallrejected]=useState(false);
    const[calling,setCalling]=useState(false)
    // const[shareScreen,setShareScreen]=useState(false);



    const userVideo=useRef({});
    const myVideo=useRef({});


    useEffect(()=>{
       navigator.mediaDevices.getUserMedia({video:true, audio:true})
       .then((currentStream)=>{
        setStream(currentStream)
        console.log("currentStream",
        currentStream) 
        myVideo.current.srcObject=currentStream
        setVideoShown(true)
        console.log(myVideo)
        for (const track of currentStream.getTracks()) {
          Peer.peer.addTrack(track, currentStream);
        }
        
       }).catch(
        (err)=>{console.log(err)}
       )

          


        socket.on("getid",({id})=>{setMyid(id)})
        
try{
        socket.on("callrecieved",({from,offer,name})=>{
          Peer.peer.addEventListener("track",(event)=>{
            const remoteStream=event.streams
            userVideo.current.srcObject=remoteStream[0];
            setUStream(remoteStream[0])
            console.log("callinggggggg>>>>>>>>>>")
            

          })
          setCall({incomingcall:true,offer,from,name})
                  
        })
      }
      catch(err)
      {console.log(err)}
       
        
           
        
    },[])

    const handlevideo=()=>{
      const videotrack=stream.getTracks().find((track)=>track.kind==="video")
      if(videotrack.enabled)
      {
        videotrack.enabled=false;
        setVideoShown(false)
      }
      else{
        videotrack.enabled=true;
        setVideoShown(true)
      }
      
    }
    const handleaudio=()=>{
      const audiotrack=stream.getTracks().find((track)=>track.kind==="audio")
      if(audiotrack.enabled)
      {
        audiotrack.enabled=false;
        setAudioShown(false)
      }
      else{
        audiotrack.enabled=true;
        setAudioShown(true)
      }
    }

    // const handleshareScreen=()=>{
    //   if(shareScreen==false)
    //   {
    //     setShareScreen(true);
       
    //     navigator.mediaDevices.getDisplayMedia({video:true, audio:true})
    //    .then((shareScreenStream)=>{
       
    //     myVideo.current.srcObject=shareScreenStream
    //       setStream(shareScreenStream)
          
    //       for (const track of shareScreenStream.getTracks()) {
    //       Peer.peer.addTrack(track, shareScreenStream);
    //       console.log(shareScreenStream)
    //     }
        
      
    //     }).catch(
    //       (err)=>{console.log(err)}
    //      )

    //    }
    //    else
    //    {
    //     setShareScreen(false);
    //     navigator.mediaDevices.getUserMedia({video:true, audio:true})
    //    .then((videoStream)=>{
    //     setStream(videoStream)
    //     myVideo.current.srcObject=videoStream
    //     setVideoShown(true)
    //     for (const track of videoStream.getTracks()) {
    //       Peer.peer.addTrack(track, videoStream);
    //     }
      
        
        
     
    //    }).catch(
    //     (err)=>{console.log(err)}
    //    )
      
       
  
    //    }}

    const handleNego=async()=>{
      try{
      const offer = await Peer.getOffer();
      socket.emit("peerNegoUsercall",{to:idToCall,from:myid,offer})

      
    }
    catch(err)
    {
        console.log(err)
    }}


    useEffect(()=>{

      Peer.peer.addEventListener("negotiationneeded",handleNego)
      return ()=>{
        Peer.peer.removeEventListener("negotiationneeded",handleNego)
      }
    },[handleNego])

   


   const  calluser=(id)=>
   {
    Peer.getOffer().then((offer)=>
        socket.emit("usercall",{to:id,from:myid,offer,name}))
        .catch(
          (err)=>{console.log(err)}
         )
setCalling(true)
    try{
    socket.on("callaccepted",async({from,to,answer,name})=>{
      await Peer.setAnswer(answer);
      setCallAccepted(true);
      setCall({incomingcall:false,from,answer,name})


    })}
    catch(err)
    {console.log(err)}

    // ////////////////////////////////////////////////
    try{
    socket.on("stopCallingonCallRejected",async({calling})=>{

      setCalling(calling);
      setCallrejected(true);
      const timer = setTimeout(() => {
        setCallrejected(false);
        leaveCall()
        
      }, 5000);
    
   })
  
  }
    catch(err)
    {console.log(err)}

    socket.on("peerNegodone",async({answer})=>{
      await Peer.setAnswer(answer);
    }) 
  

    Peer.peer.addEventListener("track",(event)=>{
      const remoteStream=event.streams
      userVideo.current.srcObject=remoteStream[0];
      setUStream(remoteStream[0])
      console.log("remote:",remoteStream);

    })
    
    
  }
       

       const rejectCall=async()=>
       {leaveCall()
        socket.emit("callRejectedByReciever",{calling:false,to:call.from})
          
       }

      const answercall=async()=>
       {try{
        const answer = await Peer.getAnswer(call.offer);
          socket.emit("answercall",{from:myid,to:call.from,answer,name})
          setCallAccepted(true);
          setCalling(false)

          socket.on("peerNegoCallrecieved",async({from,offer})=>{
            const answer2= await Peer.getAnswer(offer)
            socket.emit("peerNegofinal",{answer:answer2,to:from})
            
          })}
          catch(err)
          {
            console.log(err)
          }
          
       }
       const leaveCall=()=>{
       
        socket.emit("callHangedUp",{to:call.from})
        setcallEnded(true)
        const timer = setTimeout(() => {
          window.location.reload();
         
        }, 5000);
          

      }
      useEffect(()=>{
       socket.on("callHangedUpMessage",()=>{
        setcallEnded(true)
        const timer = setTimeout(() => {
          window.location.reload();
         
        }, 5000);
          
         
          
    
         })
      })
     
    
       
       
          return(
            <UserContext.Provider value={{setName,
            name,myid,myVideo,userVideo,callAccepted,call,callEnded,stream,idToCall,ustream,setIdToCall,
            answercall,calluser,leaveCall,videoShown,audioShown, handlevideo,handleaudio,
            calling,callrejected,setCallrejected,setCalling,rejectCall}}>
              {children}
            </UserContext.Provider>

           
          )
   
       
    
}


