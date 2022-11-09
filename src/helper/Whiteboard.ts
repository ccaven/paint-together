import Color from "./Color";

export default class Whiteboard {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.resizeCanvasToDisplaySize();

        this.ctx = this.canvas.getContext("2d");        
    }

    drawLine(a: [number, number], b: [number, number], color: Color) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color.toString();

        this.ctx.moveTo(...a);
        this.ctx.lineTo(...b);
        this.ctx.stroke();
    }

    resizeCanvasToDisplaySize() {
        const { width, height } = this.canvas.getBoundingClientRect();

        const displayWidth = Math.round(width);
        const displayHeight = Math.round(height);

        const needResize = this.canvas.width != displayWidth ||
                           this.canvas.height != displayHeight;
        
        if (needResize) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
    }

    get minSize() { return Math.min(this.canvas.width, this.canvas.height); }
}
