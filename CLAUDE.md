# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
pnpm dev          # Serveur de développement (localhost:5173)
pnpm build        # Build de production
pnpm test         # Tests unitaires (run unique)
pnpm test:watch   # Tests en mode watch
```

Lancer un test précis :
```bash
pnpm vitest run tests/crop.test.js
```

## Architecture

Application 100% client-side, pas de backend, pas de routing, pas de persistance.

**State central** — `src/stores.js` :
- `tiers` (writable) : tableau ordonné de `{ id, label, color, items: Item[] }`
- `pool` (writable) : `Item[]` non classées
- `tierActions` / `poolActions` : mutations du state (jamais de mutation directe des stores)
- `createImageItem(src)` → `{ id, src }` — toutes les images sont des data URLs base64

**Composants** (`src/components/`) :
- `TierList` → zone DnD verticale des tiers (svelte-dnd-action, `type: 'tier'`)
- `TierRow` → un tier = `TierLabel` + `ItemGrid`
- `TierLabel` → label éditable, color picker, poignée de drag
- `ItemGrid` → grille DnD horizontale d'images (`type: 'image-item'`)
- `Pool` → zone basse, même type DnD que les ItemGrid des tiers
- `ImageImporter` → import fichier + import URL avec modale de crop séquentielle
- `CropModal` → recadrage carré interactif (canvas 2D natif)

**Utilitaires** (`src/utils/`) :
- `crop.js` — math pure pour `calcInitialTransform` et `calcCropParams` (testé)
- `export.js` — `exportToPng(el)` via html2canvas, capture uniquement `#tier-list`
- `uid.js` — génération d'IDs (crypto.randomUUID avec fallback)

## Points d'attention

**DnD cross-liste** : `svelte-dnd-action` coordonne automatiquement les drops entre `ItemGrid` des tiers et le `Pool` car ils partagent le même `type: 'image-item'`. Les tiers utilisent `type: 'tier'` séparé.

**Drag handle des tiers** : `TierList` passe `onHandleEnter`/`onHandleLeave` via `TierRow` jusqu'à `TierLabel`. La poignée utilise `mouseenter`/`mouseleave` (et non `mousedown`) pour activer `dragDisabled` — le timing avec Svelte 4 impose cette approche car l'update de l'action est asynchrone.

**Import images** : `ImageImporter` traite les fichiers/URLs séquentiellement via une queue `pendingFiles`. Chaque image passe par `CropModal` avant d'aller dans le pool. L'import URL utilise `fetch` avec `mode: 'cors'` — échoue si le serveur cible bloque CORS.

**Export PNG** : `App.svelte` capture via `bind:this` uniquement le div wrappant `<TierList>` (exclut le pool et les contrôles).

**Tests** : Vitest avec `environment: 'node'` — les tests ne nécessitent pas de DOM. Seules les fonctions pures (`crop.js`) et les stores (`stores.js`) sont testés.
