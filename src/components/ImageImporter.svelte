<script>
  import CropModal from './CropModal.svelte';
  import { poolActions, createImageItem } from '../stores.js';

  let fileInputEl;
  let pendingFiles = [];      // File[] en attente de crop
  let currentSrc = null;      // data URL de l'image en cours de crop

  function openFilePicker() {
    fileInputEl.value = '';
    fileInputEl.click();
  }

  function onFilesSelected(e) {
    pendingFiles = Array.from(e.target.files);
    processNext();
  }

  function processNext() {
    if (pendingFiles.length === 0) {
      currentSrc = null;
      return;
    }
    const file = pendingFiles.shift();
    const reader = new FileReader();
    reader.onload = (ev) => {
      currentSrc = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function onConfirm(dataUrl) {
    poolActions.add(createImageItem(dataUrl));
    currentSrc = null;
    // Petit délai pour laisser la modale se fermer avant d'ouvrir la suivante
    setTimeout(processNext, 50);
  }

  function onCancel() {
    // Annuler toute la session d'import
    pendingFiles = [];
    currentSrc = null;
  }
</script>

<input
  bind:this={fileInputEl}
  type="file"
  accept="image/*"
  multiple
  style="display: none;"
  on:change={onFilesSelected}
/>

<button class="import-btn" on:click={openFilePicker}>
  + Ajouter des images
</button>

{#if currentSrc}
  <CropModal
    src={currentSrc}
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
{/if}

<style>
  .import-btn {
    padding: 8px 16px;
    background: #2a2a2a;
    border: 1px dashed #555;
    border-radius: 4px;
    color: #aaa;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .import-btn:hover {
    background: #333;
    border-color: #888;
    color: #fff;
  }
</style>
