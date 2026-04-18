<script>
  import { dndzone } from 'svelte-dnd-action';
  import TierRow from './TierRow.svelte';
  import { tiers, tierActions } from '../stores.js';

  // Pour le drag handle, on désactive le drag par défaut
  // et on l'active seulement quand la souris est sur la poignée
  let dragDisabledMap = {};

  $: {
    // Initialise dragDisabledMap pour les nouveaux tiers
    $tiers.forEach(t => {
      if (dragDisabledMap[t.id] === undefined) {
        dragDisabledMap[t.id] = true;
      }
    });
  }

  function handleConsider(e) {
    tierActions.reorder(e.detail.items);
  }

  function handleFinalize(e) {
    tierActions.reorder(e.detail.items);
    // Réactiver dragDisabled pour tous les tiers après drop
    dragDisabledMap = Object.fromEntries(
      e.detail.items.map(t => [t.id, true])
    );
  }

  function startDrag(tierId) {
    dragDisabledMap = { ...dragDisabledMap, [tierId]: false };
  }

  function stopDrag(tierId) {
    dragDisabledMap = { ...dragDisabledMap, [tierId]: true };
  }
</script>

<div id="tier-list">
  <div
    class="tiers-container"
    use:dndzone={{
      items: $tiers,
      type: 'tier',
      dragDisabled: Object.values(dragDisabledMap).every(Boolean),
      dropTargetStyle: {},
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
  >
    {#each $tiers as tier (tier.id)}
      <div
        class="tier-wrapper"
        on:mousedown={(e) => {
          // Activer le drag seulement si on clique sur .handle
          if (e.target.closest('.handle')) startDrag(tier.id);
        }}
        on:mouseup={() => stopDrag(tier.id)}
        on:mouseleave={() => stopDrag(tier.id)}
      >
        <TierRow {tier} />
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
