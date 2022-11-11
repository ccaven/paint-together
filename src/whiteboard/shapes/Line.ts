import type { Message, ShapePayload, ShapeName } from "../../types";
import Camera from "../Camera";
import Color from "../Color";
import Whiteboard from "../Whiteboard";
import Shape from "./Shape";

export default class Line extends Shape {
    public static override readonly shapeName: ShapeName = "Line";

    private readonly x1: number;
    private readonly y1: number;
    private readonly x2: number;
    private readonly y2: number;

    private readonly color: Color;

    private readonly size: number;

    constructor (x1: number, y1: number, x2: number, y2: number, color: Color, size: number) {
        super();

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.color = color;

        this.size = size;
    }

    static override fromPayload (payload: ShapePayload) {
        return new Line(
            payload.args[0], 
            payload.args[1], 
            payload.args[2], 
            payload.args[3], 
            new Color(
                payload.args[4], 
                payload.args[5], 
                payload.args[6]
            ),
            payload.args[7]
        );
    }
    
    public draw() {
        Whiteboard.instance.ctx.strokeStyle = this.color.toString();
        Whiteboard.instance.ctx.lineWidth = this.size;
        Whiteboard.instance.ctx.lineCap = "round";
        Whiteboard.instance.ctx.beginPath();
        Whiteboard.instance.ctx.moveTo(this.x1, this.y1);
        Whiteboard.instance.ctx.lineTo(this.x2, this.y2);
        Whiteboard.instance.ctx.stroke();
    }

    public override toMessage(): Message<ShapePayload> {
        return {
            label: "draw-shape",
            payload: {
                type: "Line",
                args: [ this.x1, this.y1, this.x2, this.y2, this.color.r, this.color.g, this.color.b, this.size ]
            }
        };
    }
}
