<script>
  import { pool, poolActions } from '../stores.js';
  import ItemGrid from './ItemGrid.svelte';
  import ImageImporter from './ImageImporter.svelte';

  function handleChange(newItems) {
    poolActions.setItems(newItems);
  }
</script>

<section class="pool">
  <div class="pool-header">
    <span>Images non classées</span>
    <div class="pool-header-right">
      <span class="count">{$pool.length}</span>
      <ImageImporter />
    </div>
  </div>
  <div class="pool-content">
    <ItemGrid items={$pool} onChange={handleChange} />
  </div>
</section>

<style>
  .pool {
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 1rem;
  }

  .pool-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #222;
    font-size: 0.85rem;
    color: #aaa;
  }

  .pool-header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .count {
    background: #333;
    border-radius: 10px;
    padding: 1px 7px;
    font-size: 0.75rem;
  }

  .pool-content {
    background: #1e1e1e;
    min-height: 96px;
  }
</style>
