<script>
  import CropModal from './CropModal.svelte';
  import { poolActions, createImageItem } from '../stores.js';

  let fileInputEl;
  let pendingFiles = [];
  let currentSrc = null;

  // URL import state
  let showUrlForm = false;
  let urlInput = '';
  let urlError = '';
  let urlLoading = false;

  function openFilePicker() {
    fileInputEl.value = '';
    fileInputEl.click();
  }

  function onFilesSelected(e) {
    pendingFiles = Array.from(e.target.files);
    processNext();
  }

  function processNext() {
    if (pendingFiles.length === 0) { currentSrc = null; return; }
    const file = pendingFiles.shift();
    const reader = new FileReader();
    reader.onload = (ev) => { currentSrc = ev.target.result; };
    reader.readAsDataURL(file);
  }

  function onConfirm(dataUrl) {
    poolActions.add(createImageItem(dataUrl));
    currentSrc = null;
    setTimeout(processNext, 50);
  }

  function onCancel() {
    pendingFiles = [];
    currentSrc = null;
  }

  function toggleUrlForm() {
    showUrlForm = !showUrlForm;
    urlInput = '';
    urlError = '';
  }

  async function loadFromUrl() {
    const url = urlInput.trim();
    if (!url) return;
    urlError = '';
    urlLoading = true;
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error('Erreur réseau');
      const blob = await res.blob();
      if (!blob.type.startsWith('image/')) throw new Error('Pas une image');
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      currentSrc = dataUrl;
      urlInput = '';
      showUrlForm = false;
    } catch {
      urlError = 'Impossible de charger cette image (URL invalide ou CORS bloqué).';
    } finally {
      urlLoading = false;
    }
  }

  function onUrlKeydown(e) {
    if (e.key === 'Enter') loadFromUrl();
    if (e.key === 'Escape') toggleUrlForm();
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

<div class="importer">
  <div class="btns">
    <button class="import-btn" on:click={openFilePicker}>+ Fichier</button>
    <button class="import-btn" class:active={showUrlForm} on:click={toggleUrlForm}>🌐 URL</button>
  </div>

  {#if showUrlForm}
    <div class="url-form">
      <input
        class="url-input"
        type="url"
        placeholder="https://exemple.com/image.jpg"
        bind:value={urlInput}
        on:keydown={onUrlKeydown}
        autofocus
      />
      <button class="load-btn" on:click={loadFromUrl} disabled={urlLoading || !urlInput.trim()}>
        {urlLoading ? '…' : 'Charger'}
      </button>
    </div>
    {#if urlError}
      <p class="url-error">{urlError}</p>
    {/if}
  {/if}
</div>

{#if currentSrc}
  <CropModal src={currentSrc} onConfirm={onConfirm} onCancel={onCancel} />
{/if}

<style>
  .importer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .btns {
    display: flex;
    gap: 6px;
  }

  .import-btn {
    padding: 6px 12px;
    background: #2a2a2a;
    border: 1px dashed #555;
    border-radius: 4px;
    color: #aaa;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .import-btn:hover, .import-btn.active {
    background: #333;
    border-color: #888;
    color: #fff;
  }

  .url-form {
    display: flex;
    gap: 6px;
    width: 100%;
  }

  .url-input {
    flex: 1;
    padding: 5px 8px;
    background: #2a2a2a;
    border: 1px solid #555;
    border-radius: 4px;
    color: #eee;
    font-size: 0.8rem;
    min-width: 220px;
  }

  .url-input:focus {
    outline: none;
    border-color: #4488ff;
  }

  .load-btn {
    padding: 5px 12px;
    background: #4488ff;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .load-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .url-error {
    font-size: 0.75rem;
    color: #ff6b6b;
    margin: 0;
    max-width: 320px;
    text-align: right;
  }
</style>
