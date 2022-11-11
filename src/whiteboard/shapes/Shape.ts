import type { Message, ShapeName, ShapePayload } from "../../types";

export default class Shape {
    public static readonly shapeName: ShapeName = "Shape";
    
    constructor(..._: any) {}

    static fromPayload(payload: ShapePayload) {
        let _ = payload;
        return new Shape();
    }

    public draw() {}

    public toMessage(): Message<ShapePayload> {
        return {
            label: "draw-shape",
            payload: {
                type: "Shape",
                args: []
            }
        };
    }

}