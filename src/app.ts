import type Peer from "peerjs";

interface PaintAppArguments {
    canvas: HTMLCanvasElement,
    peer: Peer
}

export default class PaintApp {

    static instance: PaintApp;

    canvas: HTMLCanvasElement;
    peer: Peer;

    constructor (config: PaintAppArguments) {
        // Singleton implementation
        PaintApp.instance = this;

        this.canvas = config.canvas;
        this.peer = config.peer;
    }

    static create (config: PaintAppArguments) {
        return new PaintApp(config);
    }

}

