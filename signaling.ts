import type { SignalingMessage } from './types.ts'
import { initPeers, callee, registerPeer } from './peers.ts'
import * as rtcConnection from './rtcConnection.ts'

export const serviceURL = 'http:localhost:8000'
export const postURL = '/api/post'
const sseURL = '/api/sse?id='
const DEBUG = true



/**  Each Map-entry holds an array of callback functions mapped to an Event name */
// deno-lint-ignore ban-types
const subscriptions = new Map<number | string, Function[]>()

/** sse - Server Sent Events listener */
export let sse: EventSource


/** Initializes this signal service event listeners */
export const initialize = (name: string, id: string) => {

    // setup peers
    initPeers(id, name)
    
    // close the sse when the window closes
    self.addEventListener('beforeunload', (ev: BeforeUnloadEvent) => {
        ev.preventDefault();
        if (sse.readyState === SSE.OPEN) {
            const sigMsg = JSON.stringify({
                    from: callee.id,
                    event: 'close',
                    data: callee.id + ' window was closed!',
                    id: 0
                })
            fetch(postURL, { method: "POST", body: sigMsg })
        }
    })

    // register for server sent events
    sse = new EventSource(sseURL + id)
 
    sse.onopen = () => {
        if (DEBUG) console.log('Sse.onOpen! >>>  rtcConnection.start()');
        rtcConnection.initialize()
    }

    // this is most always peer-count exceeded!
    sse.onerror = (err) => {
        if (DEBUG) console.error('sse.error!', err);
        //dispatch(Event.ShowPopup, {title:'Sorry!', msg:`Seats Full! Please close tab!`})
    }

    sse.onmessage = (msg: MessageEvent) => {
        if (DEBUG) console.log('<<<<  signaler got  <<<<  ', msg.data)
        const msgObject = JSON.parse(msg.data)
        const event = msgObject.event
        if (DEBUG) console.info('               event: ', event)
        dispatch(event, msgObject.data)
    }
 
    // On connect, the signal-service will send our new ID.
    sse.addEventListener('SetID', (ev: MessageEvent) => {
        const msgObject = JSON.parse(ev.data)
        const { data } = msgObject
        registerPeer( data.id, callee.name )     
        dispatch('SetID', { id: data.id, name: callee.name })
        rtcConnection.start()
    })
}

/** report the current `readyState` of the connection */
export const getState = (msg: string) => {
    if (sse.readyState === SSE.CONNECTING) console.log(msg + ' - ' + 'SSE-State - connecting')
    if (sse.readyState === SSE.OPEN) console.log(msg + ' - ' + 'SSE-State - open')
    if (sse.readyState === SSE.CLOSED) console.log(msg + ' - ' + 'SSE-State - closed')
}

/** disconnect - Stops the event stream from the client */
export const disconnect = () => {
    // closes the connection from the client side
    sse.close()
    getState('Disconnecting streamedEvents!')
}

/** Dispatch a message event to all registered listeners with optional data      	  
 * @example dispatch('ResetTurn', {currentPeerIndex: 1} )    
 * @param event (string) - the event of interest
 * @param data (string | string[] | object) - optional data to report to subscribers
 */ // deno-lint-ignore ban-types
export const dispatch = (event: string, data: string | string[] | object) => {
    if (subscriptions.has(event)) {
        const subs = subscriptions.get(event)!
        if (subs) {
            for (const callback of subs) {
                callback(data != undefined ? data : {})
            }
        }
    }
}

/** registers a callback function to be executed when a event is published
 *	@example onEvent('ResetTurn', this.resetTurn)
 *	@param event (string) - the event of interest
 *	@param listener (function) - a callback function */ // deno-lint-ignore ban-types
export const onEvent = (event: number | string, listener: Function) => {
    if (!subscriptions.has(event)) { subscriptions.set(event, []) }
    const callbacks = subscriptions.get(event)!
    callbacks.push(listener)
}

/** Sends a message to the signal service to be broadcast to peers
 *	@param msg (SignalingMessage) - contains both `event` and `data` */
export const signal = (msg: SignalingMessage) => {
    if (sse.readyState === SSE.OPEN) {
        const sigMsg = JSON.stringify({ from: callee.id, event: msg.event, data: msg.data })
        if (DEBUG) console.log('>>>>  sig-server  >>>> :', sigMsg)
        fetch(postURL, { method: "POST", body: sigMsg })
    } else {
        if (DEBUG) {
            console.error('No place to send the message:', msg.event)
        }
    }
}

/** SSE ReadyState */
export const SSE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2
}

