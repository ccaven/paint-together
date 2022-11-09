<script lang="ts">

  import Peer from 'peerjs';
  import { onMount } from 'svelte';
  import ConnectionManager from './net/ConnectionManager';
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
  
  });
</script>

<main>
    
  <canvas bind:this={drawingCanvasElement} width=256 height=256></canvas>

  <div id="header">

    <span id="invite-link" bind:this={inviteLinkSpanElement}></span>

  </div>

</main>

<style>
  :root {
    overflow: hidden;
  }

  canvas {
    padding: 0;
    margin: auto;
    display: block;
    width: 512px;
    height: 512px;
    background-color: aquamarine;
  }

  #invite-link {
    font-family: 'Courier New', Courier, monospace;
    color: blue;
    text-decoration: underline;
    background-color: white;
    padding: 5px;
  }
</style>




