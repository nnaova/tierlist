<script>
  import { dndzone } from 'svelte-dnd-action';

  /** @type {{ id: string, src: string }[]} */
  export let items = [];
  /** @type {(items: { id: string, src: string }[]) => void} */
  export let onChange;

  const ITEM_SIZE = 80; // px, taille d'une image dans la grille

  function handleConsider(e) {
    items = e.detail.items;
  }

  function handleFinalize(e) {
    onChange(e.detail.items);
  }
</script>

<div
  class="grid"
  use:dndzone={{ items, type: 'image-item', dropTargetStyle: {} }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}
>
  {#each items as item (item.id)}
    <div class="item">
      <img src={item.src} alt="" draggable="false" />
    </div>
  {/each}
</div>

<style>
  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    min-height: 88px;
    padding: 4px;
    flex: 1;
  }

  .item {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }

  .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
