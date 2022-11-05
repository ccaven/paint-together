<script lang="ts">
 
  import PaintApp from './app';
  import Peer from 'peerjs';
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let peer: Peer = new Peer();
  
  onMount(() => {
    
    PaintApp.create({
      canvas, peer
    });

  });

</script>

<main>

  <canvas id="drawing-canvas" bind:this={canvas}></canvas>

</main>



<style>
  .mono {
    font-family: 'Courier New', Courier, monospace;
  }

  #drawing-canvas {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
  }
</style>




