// PeerJS peerId's and connectionId's
export type Snowflake = string;

export type MessageLabel = 'draw-shape-many' | 'draw-shape' | 'chat-message' | 'new-member' | 'set-name' | 'introduction' | 'member-list';

export type ShapeName = "Shape" | "Line";

export type HandlerFunction = (conn: DataConnection, payload: any) => void;

export type MessageHandler = Map<MessageLabel, HandlerFunction>;

export type ShapePayload = {
    type: ShapeName;
    args: Array<any>;
};

export type Message<T> = {
    label: MessageLabel;
    payload: T;
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