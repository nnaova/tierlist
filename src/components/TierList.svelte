<script>
  import { dndzone } from 'svelte-dnd-action';
  import TierRow from './TierRow.svelte';
  import { tiers, tierActions } from '../stores.js';

  let dragDisabled = true;

  function handleConsider(e) {
    tierActions.reorder(e.detail.items);
  }

  function handleFinalize(e) {
    tierActions.reorder(e.detail.items);
    dragDisabled = true;
  }
</script>

<div id="tier-list">
  <div
    role="list"
    class="tiers-container"
    use:dndzone={{
      items: $tiers,
      type: 'tier',
      dragDisabled,
      dropTargetStyle: {},
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
  >
    {#each $tiers as tier (tier.id)}
      <div role="listitem" class="tier-wrapper">
        <TierRow {tier}
          onHandleEnter={() => { dragDisabled = false; }}
          onHandleLeave={() => { dragDisabled = true; }}
        />
      </div>
    {/each}
  </div>

  <button class="add-tier-btn" on:click={tierActions.add}>
    + Ajouter un tier
  </button>
</div>

<style>
  #tier-list {
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .tiers-container {
    min-height: 10px;
  }

  .tier-wrapper {
    user-select: none;
  }

  .add-tier-btn {
    display: block;
    width: 100%;
    padding: 10px;
    background: #2a2a2a;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-size: 0.9rem;
    text-align: center;
    transition: background 0.15s, color 0.15s;
  }

  .add-tier-btn:hover {
    background: #333;
    color: #fff;
  }
</style>
