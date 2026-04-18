import { writable } from 'svelte/store';
import { uid } from './utils/uid.js';

const TIER_DEFAULTS = [
  { label: 'S', color: '#ff4444' },
  { label: 'A', color: '#ff8c00' },
  { label: 'B', color: '#ffd700' },
  { label: 'C', color: '#44bb44' },
  { label: 'D', color: '#4488ff' },
];

function makeDefaultTiers() {
  return TIER_DEFAULTS.map(({ label, color }) => ({
    id: uid(),
    label,
    color,
    items: [],
  }));
}

export const tiers = writable(makeDefaultTiers());
export const pool = writable([]);

export function resetStores() {
  tiers.set(makeDefaultTiers());
  pool.set([]);
}

export const tierActions = {
  add() {
    tiers.update(t => [
      ...t,
      { id: uid(), label: 'Nouveau tier', color: '#888888', items: [] },
    ]);
  },

  remove(tierId) {
    let orphans = [];
    tiers.update(t => {
      const tier = t.find(x => x.id === tierId);
      if (tier) orphans = [...tier.items];
      return t.filter(x => x.id !== tierId);
    });
    pool.update(p => [...p, ...orphans]);
  },

  rename(tierId, label) {
    tiers.update(t =>
      t.map(x => (x.id === tierId ? { ...x, label } : x))
    );
  },

  setColor(tierId, color) {
    tiers.update(t =>
      t.map(x => (x.id === tierId ? { ...x, color } : x))
    );
  },

  setItems(tierId, items) {
    tiers.update(t =>
      t.map(x => (x.id === tierId ? { ...x, items } : x))
    );
  },

  reorder(newTiers) {
    tiers.set(newTiers);
  },
};

export const poolActions = {
  setItems(items) {
    pool.set(items);
  },
  add(item) {
    pool.update(p => [...p, item]);
  },
};

export function createImageItem(src) {
  return { id: uid(), src };
}
