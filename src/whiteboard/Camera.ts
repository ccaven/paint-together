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
                    ${Math.round(this.translateX)}px,
                    ${Math.round(this.translateY)}px
                ) 
                scale(
                    ${this.scale}
                )`.replaceAll(" ", "");
            
            Whiteboard.instance.recalculateBoundingRect();
        };

        window.onwheel = (event: WheelEvent) => {
            // this.scale -= event.deltaY * 0.001;
            this.scale *= Math.pow(2.0, -event.deltaY * 0.001);
            this.scale = Math.max(this.scale, 0.05);

            // TODO: also translate
            // const boundingRect = this.canvas.getBoundingClientRect();

            // let localX = event.x - boundingRect.left;
            // let localY = event.y - boundingRect.right;

            // this.translateX += (localX - this.translateX) * 0.1;
            // this.translateY += (localY - this.translateY) * 0.1;

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
