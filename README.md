# AniDa — единый launcher аниме-платформ (PC + Mobile)

AniDa — приложение-лаунчер: каталог любимых аниме-сайтов в одном месте.
Открыл AniDa → выбрал сервис → сервис открылся внутри приложения.
Контент сайтов не копируется — приложение даёт каталог, поиск, избранное,
историю и контейнер для просмотра.

- **Desktop:** Windows (приоритет), архитектура готова к macOS/Linux — Electron.
- **Mobile:** Android, iOS — Capacitor (общая React-логика, touch-first UI).
- **Дизайн:** Ember Orange по умолчанию (тёплый графит + огонь #FF7417),
  Neo-Brutalism + Flat/Material, Design Tokens, плавные анимации
  (каскад карточек, переходы страниц, скелетоны, `prefers-reduced-motion`).
- **Иконки:** только Lucide (`lucide-react`), логотипы сервисов — локальные файлы.
- **Discord Rich Presence:** только desktop, живой статус в Настройках.

## Каталог сервисов

| Сервис | Стартовый URL |
|---|---|
| AniLibria | https://anilibria.tv/ |
| AniLibria TV | https://anilibria.top/ |
| YummyAnime | https://ru.yummyani.me/ |
| Jut.su | https://jut-su.net/ |
| Kinogo Anime | https://loft.kinogo.mu/anime/ |
| Shikimori | https://shikimori.one/animes |
| AnimeGO | https://animego.org/ |
| Anixart | https://anixart.tv/ |

Данные лежат отдельно от UI — `src/data/sites.ts`. Новый сервис = одна запись,
компоненты трогать не нужно:

```ts
{
  id: 'yummy',
  name: 'YummyAnime',
  url: 'https://ru.yummyani.me/',
  origin: 'https://ru.yummyani.me',
  allowedOrigins: ['https://ru.yummyani.me'], // вся навигация внутри origin
  category: ['anime', 'popular', 'new'],
  logoText: 'YA',
  logo: 'logos/yummy.jpg', // public/logos/, fallback — буквы
  featured: true,
  tags: ['онгоинги', 'каталог'],
}
```

Проверка разрешённого URL — строго через `new URL().origin`
(`isUrlAllowedForSite`), никаких `startsWith`.

## Как открывается сайт

**Desktop (Electron `<webview>`):** настоящий браузерный контейнер.
Свободная навигация внутри `allowedOrigins`, Назад/Вперёд/Обновить работают
с текущей страницей, «Внешний браузер» открывает текущий URL.
`target="_blank"` внутри origin — в том же вью, наружу — в системный браузер.
Ошибка показывается только при падении главной рамки (сабфреймы и
`ERR_ABORTED` игнорируются). Безопасность не ослаблена: `nodeIntegration: false`,
`contextIsolation`, `sandbox`, `webSecurity` и CSP включены.

**Mobile (Capacitor):** сайты запрещают встраивание в iframe
(`X-Frame-Options` / `frame-ancestors` → `ERR_BLOCKED_BY_RESPONSE`), поэтому
вместо фрейма используется системный браузерный лист — Chrome Custom Tabs /
SFSafariViewController через `@capacitor/browser` (`src/webview/MobileSiteView.tsx`).
Отсюда же мобильная вёрстка сайтов, куки и Cloudflare. iframe оставлен только
для web-превью в dev-режиме.

## Структура

```
electron/          main.js (окно, whitelist, Discord RPC), preload.js (мост)
capacitor.config.ts  mobile-оболочка (webDir: dist)
android/ ios/      нативные проекты (иконки/сплэш уже сгенерированы)
src/
  components/      Sidebar, BottomNav, MobileHeader, SiteCard, SearchAndFilter,
                   ThemePicker, WelcomeModal, LoadingAndError, RpcStatusCard
  pages/           HomeAndCatalog, OtherPages (Favorites/History/Settings)
  layouts/         AppLayout (sidebar ↔ bottom-nav по useIsMobile)
  data/            sites.ts — каталог отдельно от UI
  services/        storage.ts, platform.ts, discordRpc/ (desktop-only), sync/
  webview/         SiteWebview.tsx (desktop) + MobileSiteView.tsx (Custom Tabs)
  themes/          themes.ts + токены в index.css
  store/           useAppStore.tsx (маршрут, избранное, история, темы)
  utils/           external.ts (Electron → Capacitor Browser → window.open)
public/            ava.png, icon.png, logos/ — логотипы сервисов
assets/            icon.ico, icon.png — иконки desktop-сборки
scripts/           make-icons.cjs — белые углы ava.jpg → прозрачность + иконки
resources/         исходники для capacitor-assets
AniDa-Apps/        готовые установщики (.exe + .apk)
builds/            техпапка сборок (desktop/android/ios)
```

Mobile UI: нижняя навигация (Главная/Каталог/Избранное/История/Настройки),
компактный header с поиском, категории горизонтальным скроллом, карточки
1–2 в ряд, тапы ≥44px, без hover-зависимостей.

Избранное/история/тема хранятся локально и идут через sync-провайдер
(`src/services/sync/`, сейчас local — работает без аккаунта). Избранное
в каталоге сортируется выше остальных.

## Темы и иконки

Цвета только через Design Tokens (`src/index.css`): `--background, --surface,
--surface-secondary, --text, --text-secondary, --border, --primary,
--primary-hover, --accent, --shadow, --radius, --spacing`. Переключение через
`data-theme`. Темы: Black & Blue (по умолчанию), Black & White, Red & Blue,
Purple, Orange, Green, Pink, Blue Light, Dark, Custom (свои цвета в Настройках).
Иконки интерфейса — только `lucide-react`, без emoji и других библиотек.

## Discord Rich Presence (только desktop)

- Client ID `1556678610407133264` вшит в `electron/main.js`
  (переопределение через env `ANIDA_DISCORD_CLIENT_ID`).
- Renderer-модуль `src/services/discordRpc/`: `connect / disconnect /
  updatePresence / clearPresence / handleAppState` + `getRpcStatus /
  onRpcStatusChange`.
- Main переподключается каждые 10 сек (Discord можно запускать после AniDa),
  `login` ограничен таймаутом 15 сек, presence ставится в очередь до коннекта.
- Статус виден в Настройках (карточка показывает ошибку текстом).
- Условия работы: запущенный десктопный Discord, включённое «Отображать
  текущую активность», существующий Application ID. Картинка в статусе
  появится после загрузки ассета `anida` в Rich Presence → Art Assets.

## Сборка

```bash
npm install
npm run dev              # web-превью
npm run electron:dev     # desktop с webview + RPC
npm run build            # только web (dist/)

# Desktop Windows:
npm run electron:build   # NSIS-установщик, имя: AniDa Setup.exe

# Mobile:
npm run mobile:android   # build → cap sync → открыть Android Studio
npm run mobile:ios       # build → cap sync → открыть Xcode (нужен macOS)
# вручную: npx cap sync android; cd android; ./gradlew assembleDebug
# (нужны Android SDK + JDK 17; SDK путь — android/local.properties)
```

Готовые файлы — `AniDa-Apps/`: `AniDa Setup.exe`, `AniDa-debug.apk`.
`.ipa` на Windows собрать нельзя — проект в `ios/` собирается на Mac через Xcode.
Иконки/сплэш phones: `npx capacitor-assets generate --android --ios
--iconBackgroundColor "#05070f" --splashBackgroundColor "#05070f"`
(исходники в `resources/`).

> Антивирус может ругаться на неподписанный установщик и сносить файлы:
> добавь исключение на папку проекта и установки
> (`Add-MpPreference -ExclusionPath "..."` от администратора).
