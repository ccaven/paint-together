import Peer from "peerjs";
import type { DataConnection, HandlerFunction, Message, MessageLabel, ShapePayload, Snowflake} from "../types";
import Shape from "../whiteboard/shapes/Shape";
import Whiteboard from "../whiteboard/Whiteboard";

export default class ConnectionManager {

    static instance: ConnectionManager;

    readonly connections = new Map<string, DataConnection>();
    readonly peerIdfromConnectionId = new Map<string, string>();

    readonly handlers = new Map<MessageLabel, HandlerFunction>();

    readonly peer: Peer;
    readonly id: string;

    private shapeQueue: ShapePayload[] = [];

    constructor (peer: Peer, id: string) {
        ConnectionManager.instance = this; // Singleton implementation

        this.peer = peer;
        this.id = id;
        
        const destroyConnection = (conn: DataConnection) => {
            conn.close();

            if (!this.connections.has(conn.connectionId)) return;

            this.connections.delete(conn.connectionId);
            this.peerIdfromConnectionId.delete(conn.connectionId);
        };

        const addConnection = (conn: DataConnection, outgoing: boolean = true) => {
            // Connection lifecycle
            conn.on("open", () => {
                // Add to list of open connections
                this.connections.set(conn.connectionId, conn);

                // Send ID to the rest of our connections
                if (outgoing) {
                    this.sendTo(conn.connectionId, 'introduction', this.id);
                }
            });            

            conn.on("data", (msg: Message<any>) => {
                // Handle data
                const {label, payload} = msg;

                if (this.handlers.has(label)) {
                    this.handlers.get(label)(conn, payload);
                }
            });

            conn.on("close", () => {
                console.log("closed connection", conn);
                destroyConnection(conn);
            });

            conn.on("error", err => {
                console.error(err);
                destroyConnection(conn);
            });
        }

        this.peer.on("connection", conn => addConnection(conn, false));

        this.handlers.set("introduction", (conn, payload) => {
            const id = payload as Snowflake;

            //this.peerIdfromConnectionId.set(conn.connectionId, id);
            this.connections.get(conn.connectionId).peerId = id;

            // Send back the member list to compare
            this.sendTo(conn.connectionId, "introduction-response", {
                id: this.id,
                memberList: this.memberList()
            });
        });

        this.handlers.set("introduction-response", (conn, payload) => {
            // compare members

            const { id: thatId, memberList: thatMemberList } = payload;

            // this.peerIdfromConnectionId.set(conn.connectionId, thatId);
            this.connections.get(conn.connectionId).peerId = thatId;
            
            const thisMemberList = this.memberList();

            for (let memberId of thatMemberList) {
                if (!thisMemberList.includes(memberId)) {
                    // say hello!
                    addConnection(this.peer.connect(memberId, { reliable: true }), true);
                }
            }
        });


        this.handlers.set("draw-shape", (_, payload: ShapePayload) => {
            // TODO: Relay this back to Whiteboard object
            // For now, console.log
            Whiteboard.instance.handleIncoming(payload);
        });

        this.handlers.set("draw-shape-many", (_, payloads: ShapePayload[]) => {
            for (const payload of payloads) {
                Whiteboard.instance.handleIncoming(payload);
            }
        });

        // Repeatedly attempt to empty queue
        setInterval(() => {
            const l = this.shapeQueue.length;
            const n = 20;

            if (l > 0) {
                if (l > n) {
                    this.sendToAll("draw-shape-many", this.shapeQueue.splice(l - n));
                } else {
                    this.sendToAll("draw-shape-many", this.shapeQueue.splice(0));
                }
            }
        }, 1000 / 60);

        // Check window args
        const args = new URLSearchParams(location.search);

        // check for join-id arg on link
        if (args.has("join-id")) {
            const joinId = args.get("join-id");
            addConnection(this.peer.connect(joinId));
        }
    }

    addShapeToQueue(shape: Shape) {
        this.shapeQueue.unshift(shape.toMessage().payload);
    }

    sendToAll(label: MessageLabel, payload: any) {
        this.connections.forEach(conn => conn.send({ label, payload }));
    }

    sendTo(connId: string, label: MessageLabel, payload: any) {
        if (this.connections.has(connId)) {
            this.connections.get(connId).send({ label, payload });
        }
    }

    memberList() { 

        function isNotNull (v: string | undefined) {
            return !(v == undefined);
        }

        return [...this.connections.values()]
            .map(conn => conn.peerId)
            .filter(isNotNull); // remove any null values
    }
}
