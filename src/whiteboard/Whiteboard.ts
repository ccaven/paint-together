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

    private boundingRect: DOMRect;
    private currentColor: Color = Color.red;
    private currentBrushSize: number = 1;

    constructor (canvas: HTMLCanvasElement) {
        Whiteboard.instance = this; // Singleton implementation

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        let previousX: number = 0;
        let previousY: number = 0;

        this.boundingRect = this.canvas.getBoundingClientRect();

        this.canvas.onmousemove = (event: MouseEvent) => {
            if (event.buttons & 1) {

                // do stuff
                // create line
                let x1 = (event.x - this.boundingRect.left) / this.boundingRect.width * this.canvas.width;
                let y1 = (event.y - this.boundingRect.top) / this.boundingRect.height * this.canvas.height;
                let x2 = (previousX - this.boundingRect.left) / this.boundingRect.width * this.canvas.width;
                let y2 = (previousY - this.boundingRect.top) / this.boundingRect.height * this.canvas.height;

                const line = new Line(
                    x1, y1, x2, y2, 
                    this.currentColor,
                    this.currentBrushSize
                );

                this.addShape(line);

                // send to others
                ConnectionManager.instance?.addShapeToQueue(line);

            }

            previousX = event.x;
            previousY = event.y;
        };

        this.canvas.onmousedown = (event: MouseEvent) => {
            if (event.buttons & 1) {
                // do stuff
                // create line
                let x1 = (event.x - this.boundingRect.left) / this.boundingRect.width * this.canvas.width;
                let y1 = (event.y - this.boundingRect.top) / this.boundingRect.height * this.canvas.height;
                const line = new Line(
                    x1, y1, x1, y1, 
                    this.currentColor,
                    this.currentBrushSize
                );

                this.addShape(line);

                // send to others
                ConnectionManager.instance?.addShapeToQueue(line);
            }
        };

        setInterval(() => this.recalculateBoundingRect(), 1000);
    }

    public setColor(c: Color) {
        this.currentColor.r = c.r;
        this.currentColor.g = c.g;
        this.currentColor.b = c.b;
    }

    public setBrushWidth(size: number) {
        this.currentBrushSize = size;
    }

    public recalculateBoundingRect() {
        this.boundingRect = this.canvas.getBoundingClientRect();
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

    get clientBoundingRect() {
        return this.boundingRect;
    }
}
