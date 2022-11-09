export default class Color {

    private readonly data: Uint8ClampedArray;
    
    constructor (r: number, g: number, b: number) {
        this.data = new Uint8ClampedArray([r, g, b]);
    }

    get r(): number { return this.data[0]; }
    get g(): number { return this.data[1]; }
    get b(): number { return this.data[2]; }

    set r(value: number) { this.data[0] = value; }
    set g(value: number) { this.data[1] = value; }
    set b(value: number) { this.data[2] = value; }

    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    public static readonly red = new Color(255, 0, 0);
    public static readonly green = new Color(0, 255, 0);
    public static readonly blue = new Color(0, 0, 255);
};