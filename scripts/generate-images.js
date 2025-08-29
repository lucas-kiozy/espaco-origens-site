// scripts/generate-images.js
import { promises as fsp } from 'fs';
import path from 'path';
import sharp from 'sharp';

const sizes = [900, 1200]; // target dimension (height para retrato, width para paisagem)
const formats = [
  { ext: 'webp', opts: { quality: 90 } },
  { ext: 'jpg',  opts: { quality: 80 } },
];

const srcDir = path.join(process.cwd(), 'public', 'images', 'pecas', 'orig');
const outDir = path.join(process.cwd(), 'public', 'images', 'pecas', 'generated');

async function run() {
  try {
    await fsp.access(srcDir);
  } catch {
    console.error('Pasta de origem não encontrada:', srcDir);
    process.exit(1);
  }

  await fsp.mkdir(outDir, { recursive: true });

  const files = (await fsp.readdir(srcDir)).filter(f => /\.(jpe?g|png)$/i.test(f));
  if (files.length === 0) {
    console.log('Nenhuma imagem encontrada em', srcDir);
    return;
  }

  for (const file of files) {
    const name = path.parse(file).name;
    const input = path.join(srcDir, file);

    // lê metadata para decidir orientação efetiva (aplica rotação EXIF logic)
    let meta;
    try {
      meta = await sharp(input).metadata();
    } catch (err) {
      console.warn('Não foi possível ler metadata de', file, err);
      meta = {};
    }

    // se EXIF indicar rotação que troca width/height, troque as dimensões efetivas
    let effectiveWidth = meta.width || 0;
    let effectiveHeight = meta.height || 0;
    const rotateSwap = [5, 6, 7, 8];
    if (meta.orientation && rotateSwap.includes(meta.orientation)) {
      [effectiveWidth, effectiveHeight] = [effectiveHeight, effectiveWidth];
    }
    const isPortrait = effectiveHeight >= effectiveWidth;

    for (const dim of sizes) {
      for (const fmt of formats) {
        const outName = `${name}-${dim}.${fmt.ext}`;
        const outPath = path.join(outDir, outName);

        // build resize options: height para retrato, width para paisagem
        const resizeOpts = isPortrait
          ? { height: dim, withoutEnlargement: true }
          : { width: dim, withoutEnlargement: true };

        try {
          await sharp(input)
            .rotate() // aplica orientação EXIF corretamente
            .resize(resizeOpts)
            .toFormat(fmt.ext, fmt.opts)
            .toFile(outPath);
          console.log('Gerado', outPath);
        } catch (err) {
          console.error('Erro gerando', outPath, err);
        }
      }
    }

    // fallback max (mantém orientação)
    const fallbackOut = path.join(outDir, `${name}-max.jpg`);
    try {
      const fallbackResize = isPortrait
        ? { height: 1100, withoutEnlargement: true }
        : { width: 1200, withoutEnlargement: true };

      await sharp(input)
        .rotate()
        .resize(fallbackResize)
        .jpeg({ quality: 90 })
        .toFile(fallbackOut);

      console.log('Gerado fallback', fallbackOut);
    } catch (err) {
      console.error('Erro gerando fallback', fallbackOut, err);
    }
  }

  console.log('Geração completa.');
}

run().catch(err => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
