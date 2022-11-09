import ConnectionManager from "../net/ConnectionManager";
import type { ShapePayload } from "../types";
import Camera from "./Camera";
import Color from "./Color";
import Line from "./shapes/Line";
import Shape from "./shapes/Shape";

const allShapes: Set<typeof Shape> = new Set([ Line ]);

export default class Whiteboard {

    static instance: Whiteboard;

    private readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly camera: Camera;

    constructor (canvas: HTMLCanvasElement) {
        Whiteboard.instance = this; // Singleton implementation

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.onmousemove = this.onMouseMove;
    }

    public handleIncoming(payload: ShapePayload) {
        const { type, args: _ } = payload;
        
        allShapes.forEach(ShapeClass => {
            if (ShapeClass.shapeName == type)
                this.addShape(ShapeClass.fromPayload(payload));
        });
    }

    public addShape(shape: Shape) {
        shape.draw();
    }

    public readonly onMouseMove = (() => {
        let previousPageX: number = 0;
        let previousPageY: number = 0;

        return (event: MouseEvent) => {

            if (event.buttons & 1) {

                // do stuff
                // create line
                const dx = event.pageX - previousPageX;
                const dy = event.pageY - previousPageY;

                const boundingRect = this.canvas.getBoundingClientRect();

                let localPageX = event.pageX - boundingRect.left;
                let localPageY = event.pageY - boundingRect.top;

                let scale = this.canvas.width / boundingRect.width;

                const line = new Line(
                    localPageX * scale, 
                    localPageY * scale, 
                    (localPageX + dx) * scale, 
                    (localPageY + dy) * scale, 
                    Color.red
                );

                this.addShape(line);

                // send to others
                const msg = line.toPayload();
                ConnectionManager.instance?.sendToAll(msg.label, msg.payload);

            }

            previousPageX = event.pageX;
            previousPageY = event.pageY;

        };
    }) ();
}
