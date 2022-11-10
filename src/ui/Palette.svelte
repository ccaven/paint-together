<script lang="ts">
  import Color from "../whiteboard/Color";
  import Whiteboard from "../whiteboard/Whiteboard";

  // const colors = [new Color(255, 0, 0), Color.blue, Color.green];

  const colors = (() => {
    let arr = [];

    for (let i = 0; i < 8; i ++) {
      let angle = Math.PI * 2 * (i / 8);
      let r = Math.cos(angle) * 128 + 128;
      let g = Math.cos(angle + Math.PI * 2 / 3) * 128 + 128;
      let b = Math.cos(angle + Math.PI * 4 / 3) * 128 + 128;

      arr.push(new Color(r, g, b));
    }

    return arr;
  }) ();

  function setColor(color: Color) {
    Whiteboard.instance.setColor(color);
  }
</script>

<!--

    List of buttons

-->

<section>
  {#each colors as color}
    <button
      style="background-color: {color}"
      on:click={() => setColor(color)}
    />
  {/each}
</section>

<style>
  button {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 0;
    margin: 0;
    padding: 0;
    transition: 0.5s;
  }

  button:hover {
    border-radius: 10px;
  }
</style>
