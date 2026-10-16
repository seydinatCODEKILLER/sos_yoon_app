const COTE_MAX = 512;

/** Recadre l'image au centre en carré, la réduit à 512 px max et l'exporte en JPEG */
export async function redimensionnerEnCarre(fichier: File): Promise<Blob> {
  const image = await createImageBitmap(fichier);

  const cote = Math.min(image.width, image.height);
  const sx = (image.width - cote) / 2;
  const sy = (image.height - cote) / 2;
  const sortie = Math.min(COTE_MAX, cote);

  const canvas = document.createElement("canvas");
  canvas.width = sortie;
  canvas.height = sortie;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    image.close();
    throw new Error("Traitement de l'image impossible sur cet appareil.");
  }

  ctx.drawImage(image, sx, sy, cote, cote, 0, 0, sortie, sortie);
  image.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Conversion de l'image impossible.")),
      "image/jpeg",
      0.85,
    );
  });
}