import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  tiers,
  pool,
  tierActions,
  poolActions,
  resetStores,
  createImageItem,
} from '../src/stores.js';

beforeEach(() => {
  resetStores();
});

describe('tierActions.add', () => {
  it('ajoute un nouveau tier à la fin', () => {
    const before = get(tiers).length;
    tierActions.add();
    const after = get(tiers);
    expect(after.length).toBe(before + 1);
    expect(after.at(-1).label).toBe('Nouveau tier');
    expect(after.at(-1).items).toEqual([]);
  });
});

describe('tierActions.remove', () => {
  it('supprime le tier cible', () => {
    const id = get(tiers)[0].id;
    tierActions.remove(id);
    expect(get(tiers).find(x => x.id === id)).toBeUndefined();
  });

  it("renvoie les items du tier supprimé dans le pool", () => {
    const img = createImageItem('data:image/png;base64,abc');
    const id = get(tiers)[0].id;
    tierActions.setItems(id, [img]);
    tierActions.remove(id);
    expect(get(pool)).toContainEqual(img);
  });
});

describe('tierActions.rename', () => {
  it('renomme le tier ciblé', () => {
    const id = get(tiers)[1].id;
    tierActions.rename(id, 'Elite');
    expect(get(tiers).find(x => x.id === id).label).toBe('Elite');
  });
});

describe('tierActions.setColor', () => {
  it('change la couleur du tier ciblé', () => {
    const id = get(tiers)[0].id;
    tierActions.setColor(id, '#abcdef');
    expect(get(tiers).find(x => x.id === id).color).toBe('#abcdef');
  });
});

describe('tierActions.setItems', () => {
  it('remplace les items du tier', () => {
    const id = get(tiers)[0].id;
    const items = [createImageItem('data:x'), createImageItem('data:y')];
    tierActions.setItems(id, items);
    expect(get(tiers).find(x => x.id === id).items).toEqual(items);
  });
});

describe('tierActions.reorder', () => {
  it('réordonne les tiers', () => {
    const original = get(tiers);
    const reversed = [...original].reverse();
    tierActions.reorder(reversed);
    expect(get(tiers).map(x => x.id)).toEqual(reversed.map(x => x.id));
  });
});

describe('poolActions', () => {
  it('setItems remplace le pool', () => {
    const items = [createImageItem('data:a')];
    poolActions.setItems(items);
    expect(get(pool)).toEqual(items);
  });

  it('add ajoute un item au pool', () => {
    const item = createImageItem('data:b');
    poolActions.add(item);
    expect(get(pool)).toContainEqual(item);
  });
});

describe('createImageItem', () => {
  it('crée un item avec un id unique et le src fourni', () => {
    const item = createImageItem('data:image/png;base64,xyz');
    expect(item.id).toBeTruthy();
    expect(item.src).toBe('data:image/png;base64,xyz');
  });

  it('génère des ids différents pour deux items', () => {
    const a = createImageItem('data:x');
    const b = createImageItem('data:x');
    expect(a.id).not.toBe(b.id);
  });
});
