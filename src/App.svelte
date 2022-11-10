<script lang="ts">

  /** TODO
   * [DONE] Mouse smoothing / precision
   * Color palette
   * Eraser
   * Brush sizes
   * [DONE] Zooming speed exponential, not linear
   * Zoom towards mouse
  */

  import Peer from 'peerjs';
  import { onMount } from 'svelte';
  import ConnectionManager from './net/ConnectionManager';
  import InviteLink from './ui/InviteLink.svelte';
  import Palette from './ui/Palette.svelte';
  import Camera from './whiteboard/Camera';
  import Whiteboard from './whiteboard/Whiteboard';

  let drawingCanvasElement: HTMLCanvasElement;
  let inviteLinkSpanElement: HTMLSpanElement;
  
  onMount(() => {
    
    const peer = new Peer();
    peer.on("open", id => {
      
      new ConnectionManager(peer, id);

      inviteLinkSpanElement.textContent = window.location.href.split("?")[0] + "?join-id=" + id;

    });

    new Whiteboard(drawingCanvasElement);
    new Camera(drawingCanvasElement);

    drawingCanvasElement.oncontextmenu = e => e.preventDefault();
  
  });
</script>

<main>
    
  <canvas bind:this={drawingCanvasElement} width=2048 height=2048></canvas>

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

  #invite-link {
    font-family: 'Courier New', Courier, monospace;
    color: blue;
    text-decoration: underline;
    background-color: white;
    padding: 5px;
  }
</style>




