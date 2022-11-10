import Whiteboard from "./Whiteboard";

export default class Camera {

    public static instance: Camera;

    // check for DOM onmousemove
    private readonly canvas: HTMLCanvasElement;

    public scale: number = 1.0;

    private translateX: number = 0.0;
    private translateY: number = 0.0;

    constructor (canvasElement: HTMLCanvasElement) {
        Camera.instance = this; // Singleton implementation

        this.canvas = canvasElement;

        // TODO: zoom in, drag

        const setStyle = () => {
            this.canvas.style.transform = `
                translate(
                    ${this.translateX}px,
                    ${this.translateY}px
                )
                scale(
                    ${this.scale}
                )`.replaceAll(" ", "");
            Whiteboard.instance.recalculateBoundingRect();
        };
        
        window.onwheel = (event: WheelEvent) => {
            const clientRect = Whiteboard.instance.clientBoundingRect;
        
            // Credit to Daniel (https://github.com/dkareh) for fixing zoom function

            // "True" in the sense that we're ignoring the CSS transformations.
            const trueCenterLeft = (clientRect.left + clientRect.width / 2) - this.translateX;
            const trueCenterTop = (clientRect.top + clientRect.height / 2) - this.translateY;
            const trueWidth = clientRect.width / this.scale;
            const trueHeight = clientRect.height / this.scale;
            const trueLeft = (clientRect.left - this.translateX - trueCenterLeft) / this.scale + trueCenterLeft;
            const trueTop = (clientRect.top - this.translateY - trueCenterTop) / this.scale + trueCenterTop;
        
            const mouseRelativeToCanvasLeft = (event.clientX - clientRect.left) * this.canvas.width / clientRect.width;
            const mouseRelativeToCanvasTop = (event.clientY - clientRect.top) * this.canvas.height / clientRect.height;
        
            this.scale *= Math.pow(2.0, -event.deltaY * 0.001);
            this.scale = Math.max(this.scale, 0.05);
        
            // Note that `this.scale` now refers to the new scale, not the old scale!
            const newMouseLeft = mouseRelativeToCanvasLeft * trueWidth * this.scale / this.canvas.width + (trueLeft - trueCenterLeft) * this.scale + trueCenterLeft;
            const newMouseTop = mouseRelativeToCanvasTop * trueHeight * this.scale / this.canvas.height + (trueTop - trueCenterTop) * this.scale + trueCenterTop;
        
            this.translateX = event.clientX - newMouseLeft;
            this.translateY = event.clientY - newMouseTop;
        
            setStyle();
        };
        
        window.onmousemove = event => {
            if (event.buttons == 2) {
                this.translateX += event.movementX;
                this.translateY += event.movementY;
                setStyle();
            }
        };
    }
    
}
