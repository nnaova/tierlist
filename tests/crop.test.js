import { describe, it, expect } from 'vitest';
import { calcCropParams, calcInitialTransform } from '../src/utils/crop.js';

describe('calcInitialTransform', () => {
  it('centre et adapte une image paysage dans le cadre de crop', () => {
    // Image 800x400, container 400x400, cropSize 280
    const t = calcInitialTransform(800, 400, 400, 280);
    // scale = max(280/800, 280/400) = max(0.35, 0.7) = 0.7
    expect(t.scale).toBeCloseTo(0.7);
    // imgW = 800*0.7 = 560, imgH = 400*0.7 = 280
    // imgX = (400 - 560) / 2 = -80
    expect(t.imgX).toBeCloseTo(-80);
    // imgY = (400 - 280) / 2 = 60
    expect(t.imgY).toBeCloseTo(60);
  });

  it('centre et adapte une image portrait dans le cadre de crop', () => {
    // Image 400x800, container 400x400, cropSize 280
    const t = calcInitialTransform(400, 800, 400, 280);
    // scale = max(280/400, 280/800) = max(0.7, 0.35) = 0.7
    expect(t.scale).toBeCloseTo(0.7);
    // imgW = 400*0.7 = 280, imgX = (400 - 280) / 2 = 60
    expect(t.imgX).toBeCloseTo(60);
    // imgH = 800*0.7 = 560, imgY = (400 - 560) / 2 = -80
    expect(t.imgY).toBeCloseTo(-80);
  });

  it('centre une image carrée égale au cropSize', () => {
    const t = calcInitialTransform(280, 280, 400, 280);
    expect(t.scale).toBeCloseTo(1);
    expect(t.imgX).toBeCloseTo(60);
    expect(t.imgY).toBeCloseTo(60);
  });
});

describe('calcCropParams', () => {
  it('calcule la région source correcte pour un crop centré', () => {
    // Image 400x400, affichée 1:1 centrée dans container 400x400, cropSize 280
    // cropOffset = (400 - 280) / 2 = 60
    // imgX = 60, imgY = 60, scale = 1
    const p = calcCropParams(60, 60, 1, 400, 280);
    // sx = (60 - 60) / 1 = 0
    expect(p.sx).toBeCloseTo(0);
    // sy = (60 - 60) / 1 = 0
    expect(p.sy).toBeCloseTo(0);
    // sw = 280 / 1 = 280
    expect(p.sw).toBeCloseTo(280);
    expect(p.sh).toBeCloseTo(280);
  });

  it('calcule la région source avec déplacement et zoom', () => {
    // scale = 2, imgX = 0, imgY = 0, container 400, cropSize 280
    // cropOffset = 60
    // sx = (60 - 0) / 2 = 30
    const p = calcCropParams(0, 0, 2, 400, 280);
    expect(p.sx).toBeCloseTo(30);
    expect(p.sy).toBeCloseTo(30);
    // sw = 280 / 2 = 140
    expect(p.sw).toBeCloseTo(140);
    expect(p.sh).toBeCloseTo(140);
  });
});
