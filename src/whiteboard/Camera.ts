
export default class Camera {

    public static instance: Camera;

    // check for DOM onmousemove
    private readonly canvas: HTMLCanvasElement;

    scale: number = 1.0;

    translateX: number = 0.0;
    translateY: number = 0.0;

    constructor (canvasElement: HTMLCanvasElement) {
        Camera.instance = this; // Singleton implementation

        this.canvas = canvasElement;

        // TODO: zoom in, drag

        const resetStyle = () => {
            this.canvas.style.transform = `translate(${Math.round(this.translateX)}px, ${Math.round(this.translateY)}px) scale(${this.scale})`;
        };

        window.onwheel = event => {
            this.scale -= event.deltaY * 0.001;
            this.scale = Math.max(this.scale, 0.05);
            resetStyle();
        };

        window.onmousemove = event => {
            if (event.buttons == 2) {
                this.translateX += event.movementX;
                this.translateY += event.movementY;
                resetStyle();
            }
        };
    }
    
}
