# Deno WebRTC Communications 

This library is a WIP for a few Deno Deploy apps:    
https://github.com/nhrones/FreshDiceRTC  see: https://fresh-dice.deno.dev/    
https://github.com/nhrones/FreshChatRTC  wip:

It includes:    
  *  A Deno-Deploy Signal Service     
        *  Client =  signaling.ts    
        *  Server = FreshDiceRTC -> routes/api/sse.ts    
  *  WebRTC connection module    
  *  A Peers management module

## See it: 
Open two instances of https://fresh-dice-rtc.deno.dev/

After the second instance(Peer) establishes a connection, the signal-server is no longer required.     
All further game communication is via a `WebRTC-dataChannel`.      
You can view the comms logs by opening the chrome devtools console.    
