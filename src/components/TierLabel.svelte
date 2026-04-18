<script>
  export let label = '';
  export let color = '#888888';
  export let onRename;   // (newLabel: string) => void
  export let onColorChange; // (newColor: string) => void
  export let onDelete;  // () => void

  let editing = false;
  let inputEl;
  let draft = label;
  $: if (!editing) draft = label;

  function startEdit() {
    draft = label;
    editing = true;
    // focus après le rendu
    setTimeout(() => inputEl?.focus(), 0);
  }

  function commitEdit() {
    if (editing) {
      editing = false;
      if (draft.trim()) onRename(draft.trim());
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { editing = false; }
  }

  function onColorInput(e) {
    onColorChange(e.target.value);
  }
</script>

<div class="label" style="background: {color};">
  <!-- Poignée de drag -->
  <span class="handle" title="Déplacer">⠿</span>

  <!-- Label éditable -->
  {#if editing}
    <input
      bind:this={inputEl}
      bind:value={draft}
      on:blur={commitEdit}
      on:keydown={onKeyDown}
      class="label-input"
      maxlength="10"
    />
  {:else}
    <span class="label-text" on:click={startEdit} title="Cliquer pour renommer">
      {label}
    </span>
  {/if}

  <!-- Controls -->
  <div class="controls">
    <label class="color-btn" title="Changer la couleur">
      <input type="color" value={color} on:input={onColorInput} />
      <span class="color-dot" style="background: {color};" />
    </label>
    <button class="delete-btn" on:click={onDelete} title="Supprimer ce tier">✕</button>
  </div>
</div>

<style>
  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100px;
    min-width: 100px;
    padding: 0 8px;
    user-select: none;
    flex-shrink: 0;
  }

  .handle {
    cursor: grab;
    font-size: 1.2rem;
    opacity: 0.6;
    line-height: 1;
  }

  .handle:active {
    cursor: grabbing;
  }

  .label-text {
    flex: 1;
    font-weight: 700;
    font-size: 1.1rem;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  .label-input {
    flex: 1;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 3px;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    padding: 2px 4px;
    width: 50px;
    text-align: center;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 3px;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .label:hover .controls {
    opacity: 1;
  }

  .color-btn {
    cursor: pointer;
    position: relative;
    display: flex;
  }

  .color-btn input[type="color"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.7);
    display: block;
  }

  .delete-btn {
    background: none;
    border: none;
    color: rgba(255,255,255,0.8);
    cursor: pointer;
    font-size: 0.7rem;
    padding: 0;
    line-height: 1;
  }

  .delete-btn:hover {
    color: #fff;
  }
</style>
