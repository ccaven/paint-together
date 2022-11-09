<script lang="ts">

  import Peer from 'peerjs';
  import { onMount } from 'svelte';
  import OnlineWhiteboard from './helper/OnlineWhiteboard';

  let canvas: HTMLCanvasElement | undefined = undefined;
  let peer: Peer | undefined = undefined;
  let board: OnlineWhiteboard | undefined = undefined;

  let inpEleText: string;
  let hideHeader: boolean = false;

  onMount(() => {
    peer = new Peer();
    board = new OnlineWhiteboard(canvas, peer);

    setInterval(() => {
      if (board.users.size > 0) {
        hideHeader = true;
      }
    }, 2000);
  });

  function onGo () {
    if (board.users.size == 0) {
      console.log("Trying to connect to", inpEleText);
      board.connectToUser(inpEleText);
      inpEleText = "";
    }
  }

  

</script>

<main>

  <div id="header" class="{hideHeader ? "hidden" : ""}">
    <p> 
      id: <span id="id-span"></span>
      <br>
      join: <input type="text" bind:value={inpEleText}> <button on:click={onGo}>go</button>
    </p>
    
  </div>

  <canvas id="drawing-canvas" bind:this={canvas} on:mousemove={board?.onMouseMove}></canvas>

</main>

<style>
  :root {
    overflow: hidden;
  }

  #drawing-canvas {
    background-color: white;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
  }

  #header {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    color: black;
    z-index: 100;
    transition: 1s ease;
  }

  #id-span {
    font-family: 'Courier New', Courier, monospace;
  }

  .hidden {
    display: none;
    opacity: 0;
  }
</style>




