import html2canvas from 'html2canvas';

/**
 * Capture un élément DOM en PNG et déclenche son téléchargement.
 * @param {HTMLElement} el - L'élément à capturer
 * @param {string} filename - Nom du fichier téléchargé
 */
export async function exportToPng(el, filename = 'tierlist.png') {
  const canvas = await html2canvas(el, {
    backgroundColor: '#1a1a1a',
    useCORS: true,
    scale: 2,           // x2 pour une meilleure résolution
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
