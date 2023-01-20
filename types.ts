
// deno-lint-ignore-file
export type Peer = {
    id: string,
    name: string,
    alias: string,
    role: PeerRole
}

type PeerRole = 'callee' | 'caller'

/** generic event Handler type */
// deno-lint-ignore no-explicit-any
export type Handler<T = any> = (data: T) => void;

/** SignalingMessage type */
export type SignalingMessage = {
    event: string,
    data: 
    | RTCSessionDescriptionInit 
    | RTCIceCandidateInit 
    | object 
    | string[] 
    | string 
    | number
}

/** Events types */
export type TypedEvent = {
    DieTouched: {index: number},
    HidePopup: {},
    PopupResetGame: {
        show: boolean, 
        title: string, 
        msg: string
    },
    ResetGame: string,
    ResetTurn: string,
    RemovePeer: string,
    RegisterPeer: {id: string, name: string},
    RollButtonTouched: {},
    PeerDisconnected: {},
    ScoreButtonTouched: number,
    ScoreElementResetTurn: string,
    SetID: {id: string, name: string},
    ShowPopup: {title: string, msg: string},
    UpdateDie: {
        index: number, 
        value?: number, 
        frozen?: boolean
    },
    UpdateInfo: string,
    UpdateLeftscore: {color: string, text: string},
    UpdatePeers: any[],
    UpdatePlayer: {
        index: number, 
        color: string, 
        text: string
    },
    UpdateRoll: string,
    UpdateRollButton: {
        text: string, 
        color: string, 
        disabled: boolean
    },
    UpdateScore: number,
    UpdateScoreElement: {
        index: number, 
        renderAll: boolean, 
        fillColor: string, 
        value: string, 
        available: boolean
    },
    UpdateTooltip: {index: number, hovered: boolean},
    UpdateUI: string,
    ViewWasAdded: {
        type: string, 
        index: number, 
        name: string
    },
}