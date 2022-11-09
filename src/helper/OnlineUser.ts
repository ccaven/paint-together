import Peer from 'peerjs';

import Color from "./Color";
import OnlineWhiteboard from './OnlineWhiteboard';

let _: Peer = null;

type MessageLabel = "draw-line" | "set-color" | "set-name";
type Point = [number, number];

type MessageHandler = (msg: Message) => void;

interface Message {
    label: MessageLabel,
    payload: any
}

const nextId = (() => {
    let id = 0;
    return () => {
        return id++;
    };
})();

export default class OnlineUser {

    private readonly conn: any;
    private readonly onlineWhiteboard: OnlineWhiteboard;

    private readonly handleIncoming = new Map<MessageLabel, MessageHandler>();

    private color: Color;
    private nickname: string;

    constructor(conn: any, onlineWhiteboard: OnlineWhiteboard) {
        this.conn = conn;
        this.onlineWhiteboard = onlineWhiteboard;

        this.color = new Color(0, 255, 0);
        this.nickname = `user${nextId()}`;

        this.handleIncoming.set("draw-line", ({ payload }) => {
            const a: Point = [payload[0], payload[1]] as Point;
            const b: Point = [payload[2], payload[3]] as Point;
            this.onlineWhiteboard.drawLine(a, b, this.color);
        });

        this.handleIncoming.set("set-color", ({ payload }) => {
            this.color.r = payload[0];
            this.color.g = payload[1];
            this.color.b = payload[2];
        });

        this.handleIncoming.set("set-name", ({ payload }) => {
            this.nickname = new String(payload).toString();
        });

        this.conn.on("data", (msg: any) => {
            if (this.handleIncoming.has(msg.label)) {
                const handler = this.handleIncoming.get(msg.label);
                handler(msg);
            }
        });
    }

    send(label: MessageLabel, payload: any) {
        this.conn.send({ label, payload });
    }
}
