<script>
  import TierLabel from './TierLabel.svelte';
  import ItemGrid from './ItemGrid.svelte';
  import { tierActions } from '../stores.js';

  export let tier;

  function handleRename(newLabel) {
    tierActions.rename(tier.id, newLabel);
  }

  function handleColorChange(newColor) {
    tierActions.setColor(tier.id, newColor);
  }

  function handleDelete() {
    tierActions.remove(tier.id);
  }

  function handleItemsChange(newItems) {
    tierActions.setItems(tier.id, newItems);
  }
</script>

<div class="row">
  <TierLabel
    label={tier.label}
    color={tier.color}
    onRename={handleRename}
    onColorChange={handleColorChange}
    onDelete={handleDelete}
  />
  <ItemGrid items={tier.items} onChange={handleItemsChange} />
</div>

<style>
  .row {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid #2a2a2a;
    min-height: 96px;
  }
</style>
