<script lang="ts">
  import { CANVAS_SCALE_FACTOR } from "../constants";
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

    arr.push(new Color(255, 255, 255));

    return arr;
  }) ();

  const brushWidths = [1, 3, 5, 10, 15, 25, 35, 50, 75];

  function setColor(color: Color) {
    Whiteboard.instance.setColor(color);
  }

  function setBrushWidth(width: number) {
    Whiteboard.instance.setBrushWidth(width * CANVAS_SCALE_FACTOR);
  }

  function mapWidth(width: number) {
    let minSize = 10;
    let maxSize = 60;

    let minWidth = 1;
    let maxWidth = 50;

    return (width - minWidth) / (maxWidth - minWidth) * (maxSize - minSize) + minSize;
  }

  function computeRadialGradient(width) {
    return `background: radial-gradient(
      white ${mapWidth(width)}%, 
      black ${mapWidth(width)+5}%, 
      rgba(0,0,0,0) ${mapWidth(width)+10}%
    )`;
  }

  let colorPickerEle: HTMLInputElement;
  function onInput() {
    let rString = colorPickerEle.value.slice(1, 3);
    let gString = colorPickerEle.value.slice(3, 5);
    let bString = colorPickerEle.value.slice(5, 7);

    let r = parseInt(rString, 16);
    let g = parseInt(gString, 16);
    let b = parseInt(bString, 16);

    let color = new Color(r, g, b);
    
    setColor(color);
  }
</script>

<section>
  <input type="color" on:change={onInput} bind:this={colorPickerEle}>
  {#each colors as color}
    <button
      style="background-color: {color}"
      on:click={() => setColor(color)}
    />
  {/each}
  {#each brushWidths as width, i}
    <button
      class="background-button"
      style={computeRadialGradient(width)}
      on:click={() => setBrushWidth(width)}
    />
  {/each}
</section>

<style>


  button {
    width: 50px;
    height: 50px;
    /*border: none;*/
    border: 1px solid white;
    border-radius: 0;
    margin: 0;
    padding: 0;
    transition: 0.5s;
    place-items: center;
  }

  button:hover {
    border-radius: 10px;
  }

  .background-button {
    /* background: radial-gradient(white, black); */
    background-position: center;
    background-repeat: no-repeat;
  }

  input[type="color"] {
    border-radius: 50%;
    border: none;
    height: 50px;
    width: 50px;
    border: none;
    outline: none;
    -webkit-appearance: none;
    background-color: white;
  }
  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0; 
  }
  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
  }

</style>
