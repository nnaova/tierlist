<script>
  import TierList from './components/TierList.svelte';
  import Pool from './components/Pool.svelte';
  import { exportToPng } from './utils/export.js';

  let tierListEl;
  let exporting = false;

  async function handleExport() {
    if (!tierListEl || exporting) return;
    exporting = true;
    try {
      await exportToPng(tierListEl, 'tierlist.png');
    } finally {
      exporting = false;
    }
  }
</script>

<main>
  <header>
    <h1>Tierlist</h1>
    <button class="export-btn" on:click={handleExport} disabled={exporting}>
      {exporting ? 'Export...' : '⬇ Exporter PNG'}
    </button>
  </header>

  <div bind:this={tierListEl}>
    <TierList />
  </div>

  <Pool />
</main>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    background: #1a1a1a;
    color: #f0f0f0;
    font-family: system-ui, sans-serif;
    min-height: 100vh;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
    color: #fff;
  }

  .export-btn {
    padding: 8px 18px;
    background: #4488ff;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .export-btn:hover:not(:disabled) {
    background: #5599ff;
  }

  .export-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }
</style>
