<script lang="ts">

  /** TODO
   * [DONE] Mouse smoothing / precision
   * [DONE] Color palette
   * [DONE] Eraser
   * [DONE] Brush sizes
   * [DONE] Zooming speed exponential, not linear
   * [DONE] Zoom towards mouse
   * [DONE] Limit network activity
   * [DONE] Draw point if no mouse movement
   * [DONE] Color picked via <input type="color"
   * [    ] $8 membership
  */

  import { onMount } from 'svelte';
  
  import Peer from 'peerjs';
  import ConnectionManager from './net/ConnectionManager';
  import InviteLink from './ui/InviteLink.svelte';
  import Palette from './ui/Palette.svelte';
  import Camera from './whiteboard/Camera';
  import Whiteboard from './whiteboard/Whiteboard';
  import { CANVAS_SCALE_FACTOR } from './constants';

  let drawingCanvasElement: HTMLCanvasElement;
  
  onMount(() => {
    
    const peer = new Peer();
    peer.on("open", id => {
      new ConnectionManager(peer, id);
    });

    new Whiteboard(drawingCanvasElement);
    new Camera(drawingCanvasElement);

    drawingCanvasElement.oncontextmenu = e => e.preventDefault();
  
  });
</script>

<main>
    
  <canvas bind:this={drawingCanvasElement} width={2048*CANVAS_SCALE_FACTOR} height={2048*CANVAS_SCALE_FACTOR}></canvas>

  <header>
    <div class="centered">
      <InviteLink/>
    </div>
  </header>
  
  <footer>
    <div class="centered">
      <Palette/>
    </div>
  </footer>

</main>

<style>
  .centered {
    width: 100%;
  }

  :root {
    overflow: hidden;
  }

  canvas {
    display: fixed;
    padding: 0;
    margin: auto;
    display: block;
    width: 512px;
    height: 512px;
    background-color: white;
    border: none;
  }

  header {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
  }

  footer {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100vw;
  }
</style>




