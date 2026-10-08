// scripts/make-icons.cjs — готовит иконки AniDa из ava.jpg:
// 1. Убирает белые углы (near-white пиксели, связанные с краем → прозрачность).
// 2. Кладёт public/ava.png, public/icon.png, assets/icon.png/.ico.
// 3. Копирует логотипы сервисов в public/logos/.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const _p2i = require('png-to-ico');
const pngToIco = _p2i.default || _p2i;

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const ASSETS = path.join(ROOT, 'assets');
const LOGOS = path.join(PUB, 'logos');

const NEAR_WHITE = 242; // каналы выше — считаем белым фоном углов

async function removeWhiteCorners(input) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const isWhite = (i) => data[i] > NEAR_WHITE && data[i + 1] > NEAR_WHITE && data[i + 2] > NEAR_WHITE;

  // BFS от всех граничных белых пикселей
  const mask = new Uint8Array(w * h); // 1 = прозрачный
  const stack = [];
  const push = (x, y) => {
    const idx = y * w + x;
    if (mask[idx]) return;
    if (!isWhite(idx * c)) return;
    mask[idx] = 1;
    stack.push(idx);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  // Применяем маску + эрозия 1px у границы (убирает JPEG-ореол)
  let transparent = 0;
  const erode = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i]) continue;
      if (
        (x > 0 && mask[i - 1]) ||
        (x < w - 1 && mask[i + 1]) ||
        (y > 0 && mask[i - w]) ||
        (y < h - 1 && mask[i + w])
      ) {
        erode[i] = 1;
      }
    }
  }
  for (let i = 0; i < w * h; i++) {
    if (mask[i] || erode[i]) {
      data[i * c + 3] = 0;
      transparent++;
    }
  }
  console.log(`corners removed: ${transparent} px (${((transparent / (w * h)) * 100).toFixed(2)}%) of ${w}x${h}`);
  return sharp(data, { raw: { width: w, height: h, channels: c } }).png();
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  fs.mkdirSync(LOGOS, { recursive: true });

  const cleaned = await removeWhiteCorners(path.join(ROOT, 'ava.jpg'));

  // Полная аватарка с прозрачными углами (для UI)
  await cleaned.clone().toFile(path.join(PUB, 'ava.png'));
  // Квадратная иконка 1024 (cover — арт и так почти квадрат)
  await cleaned.clone().resize(1024, 1024, { fit: 'cover' }).toFile(path.join(PUB, 'icon.png'));
  await cleaned.clone().resize(512, 512, { fit: 'cover' }).toFile(path.join(ASSETS, 'icon-512.png'));
  await cleaned.clone().resize(256, 256, { fit: 'cover' }).toFile(path.join(ASSETS, 'icon.png'));

  // .ico набор для Windows
  const sizes = [256, 128, 64, 48, 32, 16];
  const tmp = [];
  for (const s of sizes) {
    const p = path.join(ASSETS, `tmp-${s}.png`);
    await cleaned.clone().resize(s, s, { fit: 'cover' }).toFile(p);
    tmp.push(p);
  }
  const ico = await pngToIco(tmp);
  fs.writeFileSync(path.join(ASSETS, 'icon.ico'), ico);
  for (const p of tmp) fs.unlinkSync(p);
  console.log('icons written: public/ava.png, public/icon.png, assets/icon.png, assets/icon-512.png, assets/icon.ico');

  // Логотипы сервисов → public/logos/
  const map = {
    anilibria: 'AniLibria.jpg',
    'anilibria-tv': 'AniLibria TV.jpg',
    yummy: 'YummyAnime.jpg',
    jutsu: 'Jut.su.jpg',
    shikimori: 'Shikimori.png',
    animego: 'AnimeGO.png',
    anixart: 'Anixart.png',
  };
  for (const [id, file] of Object.entries(map)) {
    const src = path.join(ROOT, file);
    if (!fs.existsSync(src)) {
      console.log(`[logos] MISSING ${file}`);
      continue;
    }
    const ext = path.extname(file).toLowerCase();
    const meta = await sharp(src).metadata();
    const dst = path.join(LOGOS, `${id}${ext}`);
    fs.copyFileSync(src, dst);
    console.log(`[logos] ${id} <- ${file} (${meta.width}x${meta.height})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
