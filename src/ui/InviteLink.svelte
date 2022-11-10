<script lang="ts">
  import ConnectionManager from "../net/ConnectionManager";

  let spanElement: HTMLSpanElement;

  function onClick() {
    if (ConnectionManager.instance) {
      const id = ConnectionManager.instance.id;
      const link = window.location.href.split("?")[0] + "?join-id=" + id;

      navigator.clipboard.writeText(link);

      spanElement.style.display = "inline-block";
      setTimeout(() => spanElement.style.display = "none", 5000);


    }
  }
</script>

<button on:click={onClick}>Copy invite link</button> 
<span bind:this={spanElement}>Copied!</span>

<style>
    button {
        margin: auto;  
    }

    span {
        color: greenyellow;
        display: none;
        transition: 0.5s;
    }
</style>
