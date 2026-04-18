/**
 * Calcule la transformation initiale pour centrer une image dans le container
 * et la dimensionner pour couvrir le cadre de crop.
 *
 * @param {number} naturalW  - Largeur naturelle de l'image
 * @param {number} naturalH  - Hauteur naturelle de l'image
 * @param {number} containerSize - Taille du container carré en px
 * @param {number} cropSize  - Taille du cadre de crop carré en px
 * @returns {{ scale: number, imgX: number, imgY: number }}
 */
export function calcInitialTransform(naturalW, naturalH, containerSize, cropSize) {
  const scale = Math.max(cropSize / naturalW, cropSize / naturalH);
  const imgX = (containerSize - naturalW * scale) / 2;
  const imgY = (containerSize - naturalH * scale) / 2;
  return { scale, imgX, imgY };
}

/**
 * Calcule les paramètres de la région source à dessiner sur le canvas de sortie.
 *
 * @param {number} imgX - Position X de l'image dans le container
 * @param {number} imgY - Position Y de l'image dans le container
 * @param {number} scale - Facteur de zoom courant
 * @param {number} containerSize - Taille du container carré en px
 * @param {number} cropSize - Taille du cadre de crop carré en px
 * @returns {{ sx: number, sy: number, sw: number, sh: number }}
 */
export function calcCropParams(imgX, imgY, scale, containerSize, cropSize) {
  const cropOffset = (containerSize - cropSize) / 2;
  const sx = (cropOffset - imgX) / scale;
  const sy = (cropOffset - imgY) / scale;
  const sw = cropSize / scale;
  const sh = cropSize / scale;
  return { sx, sy, sw, sh };
}
