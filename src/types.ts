// PeerJS peerId's and connectionId's
export type Snowflake = string;

export type MessageLabel = 'draw-shape' | 'chat-message' | 'new-member' | 'set-name' | 'introduction' | 'member-list';

export type HandlerFunction = (conn: DataConnection, payload: any) => void;

export type MessageHandler = Map<MessageLabel, HandlerFunction>;

export type Message = {
    label: MessageLabel,
    payload: any
};

export interface DataConnection {
    send: Function;
    close: Function;
    on: Function;
    dataChannel: RTCDataChannel;
    label: string;
    metadata: any;
    open: boolean;
    peerConnection: RTCPeerConnection;
    reliable: boolean;
    serialization: string;
    type: string;
    bufferSize: number;
    connectionId: string;
}