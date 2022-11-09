import Peer from "peerjs";

import Color from "./Color";
import OnlineUser from "./OnlineUser";
import Whiteboard from "./Whiteboard";

export default class OnlineWhiteboard extends Whiteboard {
    static instance: OnlineWhiteboard;

    public readonly users: Map<string, OnlineUser> = new Map();
    public readonly peer: Peer;

    id: string | undefined;

    constructor (canvas: HTMLCanvasElement, peer: Peer) {
        super(canvas);

        this.peer = peer;

        this.peer.on("open", id => {
            this.id = id;
            console.log("Received an ID of ", this.id);

            document.getElementById("id-span").textContent = this.id;
        });

        this.peer.on("connection", conn => {
            
            conn.on("open", () => {

                // Add connection
                console.log("Connection received", conn.connectionId);

                const connectionId = conn.connectionId;
                const user = new OnlineUser(conn, this);
                this.users.set(connectionId, user);

            });
            
        });

        OnlineWhiteboard.instance = this;
    }

    public connectToUser(userId: string) {
        const conn = this.peer.connect(userId);

        conn.on("open", () => {
            
            console.log("Connection initiated", conn.connectionId);
            
            const user = new OnlineUser(conn, this);
            this.users.set(conn.connectionId, user);

        });

        conn.on("close", () => {

            this.users.delete(conn.connectionId);

        });
    }

    public readonly onMouseMove = (() => {
        
        let previousClientX: number = 0;
        let previousClientY: number = 0;

        return (event: MouseEvent) => {

            if (event.buttons == 1) {

                this.drawLine([event.clientX, event.clientY], [previousClientX, previousClientY], new Color(255, 0, 0));
                
                this.users.forEach(user => {
                    user.send("draw-line", [event.clientX, event.clientY, previousClientX, previousClientY]);
                });

            }

            previousClientX = event.clientX;
            previousClientY = event.clientY;
        };

    }) ();
}
