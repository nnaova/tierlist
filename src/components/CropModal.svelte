<script>
  import { calcInitialTransform, calcCropParams } from '../utils/crop.js';

  export let src;            // data URL de l'image originale
  export let onConfirm;      // (dataUrl: string) => void
  export let onCancel;       // () => void

  const CONTAINER_SIZE = 400;
  const CROP_SIZE = 280;
  const OUTPUT_SIZE = 300;   // taille de l'image cropée en pixels

  let imgEl;
  let imgX = 0;
  let imgY = 0;
  let scale = 1;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let imgStartX = 0;
  let imgStartY = 0;

  function onLoad() {
    const t = calcInitialTransform(
      imgEl.naturalWidth,
      imgEl.naturalHeight,
      CONTAINER_SIZE,
      CROP_SIZE
    );
    scale = t.scale;
    imgX = t.imgX;
    imgY = t.imgY;
  }

  function onMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    imgStartX = imgX;
    imgStartY = imgY;
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    imgX = imgStartX + (e.clientX - dragStartX);
    imgY = imgStartY + (e.clientY - dragStartY);
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onWheel(e) {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    const newScale = Math.max(0.05, scale * factor);
    // Zoom centré sur le centre du container
    const cx = CONTAINER_SIZE / 2;
    const cy = CONTAINER_SIZE / 2;
    imgX = cx - (cx - imgX) * (newScale / scale);
    imgY = cy - (cy - imgY) * (newScale / scale);
    scale = newScale;
  }

  function onSliderInput(e) {
    const newScale = parseFloat(e.target.value);
    const cx = CONTAINER_SIZE / 2;
    const cy = CONTAINER_SIZE / 2;
    imgX = cx - (cx - imgX) * (newScale / scale);
    imgY = cy - (cy - imgY) * (newScale / scale);
    scale = newScale;
  }

  function confirm() {
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');

    const { sx, sy, sw, sh } = calcCropParams(
      imgX, imgY, scale, CONTAINER_SIZE, CROP_SIZE
    );

    ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    onConfirm(canvas.toDataURL('image/jpeg', 0.92));
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="overlay" on:click|self={onCancel}>
  <div class="modal">
    <h2>Recadrer l'image</h2>

    <!-- Zone de crop -->
    <div
      class="crop-container"
      style="width: {CONTAINER_SIZE}px; height: {CONTAINER_SIZE}px;"
      on:mousedown={onMouseDown}
      on:mousemove={onMouseMove}
      on:mouseup={onMouseUp}
      on:mouseleave={onMouseUp}
      on:wheel={onWheel}
    >
      <!-- Image déplaçable -->
      <img
        bind:this={imgEl}
        {src}
        on:load={onLoad}
        style="
          position: absolute;
          left: {imgX}px;
          top: {imgY}px;
          width: {imgEl ? imgEl.naturalWidth * scale : 0}px;
          height: {imgEl ? imgEl.naturalHeight * scale : 0}px;
          pointer-events: none;
        "
        draggable="false"
        alt=""
      />

      <!-- Masque sombre autour du cadre -->
      <div class="mask mask-top"
        style="height: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;" />
      <div class="mask mask-bottom"
        style="height: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;" />
      <div class="mask mask-left"
        style="
          top: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;
          height: {CROP_SIZE}px;
          width: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;
        " />
      <div class="mask mask-right"
        style="
          top: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;
          height: {CROP_SIZE}px;
          width: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;
        " />

      <!-- Cadre de crop -->
      <div
        class="crop-frame"
        style="
          width: {CROP_SIZE}px;
          height: {CROP_SIZE}px;
          top: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;
          left: {(CONTAINER_SIZE - CROP_SIZE) / 2}px;
        "
      />
    </div>

    <!-- Slider de zoom -->
    <div class="zoom-row">
      <span>🔍</span>
      <input
        type="range"
        min="0.1"
        max="5"
        step="0.01"
        value={scale}
        on:input={onSliderInput}
      />
    </div>

    <p class="hint">Glissez l'image • Molette ou slider pour zoomer</p>

    <div class="actions">
      <button class="btn-cancel" on:click={onCancel}>Annuler</button>
      <button class="btn-confirm" on:click={confirm}>Valider</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: #222;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: 95vw;
  }

  h2 {
    font-size: 1rem;
    color: #fff;
    align-self: flex-start;
  }

  .crop-container {
    position: relative;
    overflow: hidden;
    cursor: move;
    background: #000;
    flex-shrink: 0;
  }

  .mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.55);
    pointer-events: none;
    z-index: 1;
  }

  .mask-top    { top: 0; left: 0; right: 0; }
  .mask-bottom { bottom: 0; left: 0; right: 0; }
  .mask-left   { left: 0; }
  .mask-right  { right: 0; }

  .crop-frame {
    position: absolute;
    border: 2px solid #fff;
    pointer-events: none;
    z-index: 2;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
  }

  .zoom-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .zoom-row input[type="range"] {
    flex: 1;
  }

  .hint {
    font-size: 0.75rem;
    color: #777;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    align-self: flex-end;
  }

  .btn-cancel {
    padding: 8px 18px;
    background: #333;
    border: none;
    border-radius: 4px;
    color: #ccc;
    cursor: pointer;
  }

  .btn-confirm {
    padding: 8px 18px;
    background: #4488ff;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
  }

  .btn-confirm:hover { background: #5599ff; }
  .btn-cancel:hover  { background: #444; }
</style>
