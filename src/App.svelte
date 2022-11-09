<script lang="ts">

  import Peer from 'peerjs';
  import { onMount } from 'svelte';
  import OnlineWhiteboard from './helper/OnlineWhiteboard';
  import ConnectionManager from './net/ConnectionManager';

  let inpEleText: string;
  let spanEle: HTMLSpanElement;
  let inpUsername: string;

  onMount(() => {
    const peer = new Peer();

    peer.on("open", id => {

      const connectionManager = new ConnectionManager(peer, id);

      spanEle.textContent = location.href + "?join-id=" + id;

    });

  });

  function onSendChat() {
    ConnectionManager.instance.sendToAll('chat-message', inpEleText);

    inpEleText = "";
  }

  function onSendUsername() {
    ConnectionManager.instance.sendToAll('set-name', inpUsername);
  }
</script>

<main>

  <p>
    name: <input type="text" bind:value={inpUsername}> <button on:click={onSendUsername}>send</button>
    <br>
    chat: <input type="text" bind:value={inpEleText}/> <button on:click={onSendChat}>send</button>
    <br>
    join link: <span bind:this={spanEle}></span>

  </p>

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




