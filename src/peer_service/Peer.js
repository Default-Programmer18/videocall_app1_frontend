class Peer{
    constructor()
    {
        if(!this.peer)
        {
            this.peer=new RTCPeerConnection({
                iceServers:[{
                    urls:[
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                
                    ]
                }]
            })
        }
    }

    getOffer=async()=>{
        if(this.peer)
        {
            const offer=await this.peer.createOffer()
            this.peer.setLocalDescription(new RTCSessionDescription(offer))
            return offer

        }
    }
        getAnswer=async(offer)=>{
            if(this.peer)
            {
                this.peer.setRemoteDescription(offer)
                const answer=await this.peer.createAnswer();
                this.peer.setLocalDescription(new RTCSessionDescription(answer))
                return answer

            }
        }

        setAnswer=async(answer)=>{
            if(this.peer)
            {
                await this.peer.setRemoteDescription(answer)
            }
        }
       

    
}
export default new Peer();