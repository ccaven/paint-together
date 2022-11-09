import Peer from "peerjs";
import type { DataConnection, HandlerFunction, Message, MessageLabel, ShapePayload, Snowflake} from "../types";
import Whiteboard from "../whiteboard/Whiteboard";

export default class ConnectionManager {

    static instance: ConnectionManager;

    readonly connections = new Map<string, DataConnection>();
    readonly nicknames = new Map<string, string>();
    readonly peerIds = new Map<string, string>();
    readonly handlers = new Map<MessageLabel, HandlerFunction>();

    readonly peer: Peer;
    readonly id: string;

    constructor (peer: Peer, id: string) {
        ConnectionManager.instance = this; // Singleton implementation

        this.peer = peer;
        this.id = id;

        let nextUser = 1;
        
        const destroyConnection = (conn: DataConnection) => {
            conn.close();

            if (!this.connections.has(conn.connectionId)) return;

            this.connections.delete(conn.connectionId);
            this.nicknames.delete(conn.connectionId);
            this.peerIds.delete(conn.connectionId);
        };

        const addConnection = (conn: DataConnection, outgoing: boolean = true) => {
            conn.on("open", () => {
                // Add to list of open connections
                this.connections.set(conn.connectionId, conn);
                this.nicknames.set(conn.connectionId, `User${nextUser++}`);

                // Send ID to the rest of our connections
                if (outgoing) {
                    this.sendTo(conn.connectionId, 'introduction', this.id);
                }
            });

            conn.on("close", () => destroyConnection(conn));
            conn.on("error", () => destroyConnection(conn));

            conn.on("data", (msg: Message<any>) => {
                // Handle data
                const {label, payload} = msg;

                if (this.handlers.has(label)) {
                    this.handlers.get(label)(conn, payload);
                }
            });
        }

        this.peer.on("connection", conn => addConnection(conn, false));

        this.handlers.set("introduction", (conn, payload) => {
            const id = payload as Snowflake;
            this.peerIds.set(conn.connectionId, id);

            // Send back the member list to compare
            this.sendTo(conn.connectionId, "member-list", this.memberList);
        });

        this.handlers.set("member-list", (_, payload) => {
            // compare members
            const memberList = this.memberList;
            for (let memberId of payload) {
                if (!memberList.includes(memberId)) {
                    // say hello!
                    addConnection(this.peer.connect(memberId, { reliable: true }), true);
                }
            }
        });

        this.handlers.set("set-name", (conn, payload) => {
            const nickname = payload as string;
            this.nicknames.set(conn.connectionId, nickname);
        });

        this.handlers.set("chat-message", (conn, payload) => {
            // TODO: Relay this back to the Whiteboard object
            // For now, console.log
            const connectionId = conn.connectionId;
            const nickname = this.nicknames.get(connectionId);

            console.log(nickname, "says", payload);
        });

        this.handlers.set("draw-shape", (conn, payload: ShapePayload) => {
            // TODO: Relay this back to Whiteboard object
            // For now, console.log
            const connectionId = conn.connectionId;
            const nickname = this.nicknames.get(connectionId);
            console.log(nickname, "draws", payload);

            Whiteboard.instance.handleIncoming(payload);
        });

        // Check window args
        const args = new URLSearchParams(location.search);

        if (args.has("join-id")) {
            const joinId = args.get("join-id");
            addConnection(this.peer.connect(joinId));
        }
    }

    sendToAll(label: MessageLabel, payload: any) {
        this.connections.forEach(conn => conn.send({ label, payload }));
    }

    sendTo(connId: string, label: MessageLabel, payload: any) {
        if (this.connections.has(connId)) {
            this.connections.get(connId).send({ label, payload });
        }
    }

    get memberList() { return [...this.peerIds.values()]; }
}
