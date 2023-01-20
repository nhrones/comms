
import type {TypedEvent, Handler} from './types.ts'

/** event handlers map */
const eventHandlers: Map<keyof TypedEvent, Handler[]> = new Map()

/** registers a handler function to be executed when an event is fired */
export const on = <key extends keyof TypedEvent>(event: key, handler: Handler): void => {
    if (eventHandlers.has(event)) {
        const handlers = eventHandlers.get(event)!
        handlers.push(handler)
    } else { // not found - create it
        eventHandlers.set(event, [handler])
    }
}

/** execute all registered handlers for event name */
export const fire = <key extends keyof TypedEvent>(event: key, data?: TypedEvent[key]) => {
    const handlers = eventHandlers!.get(event)
    if (handlers) {
        for (const handler of handlers) {
            if(data != undefined) {
                handler(data)
            }
        }
    }
}
