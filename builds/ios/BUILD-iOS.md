# Сборка AniDa для iOS — только на Mac

`.ipa` нельзя собрать на Windows: нужны Xcode + подпись Apple.
Проект уже полностью готов: иконки, сплэш, Capacitor-синк, версия 1.1,
Bundle ID `com.anida.launcher`.

## Что нужно на Mac

1. Xcode из App Store, запусти один раз и прими лицензию.
2. Apple ID в Xcode → Settings → Accounts (для запуска на своём iPhone
   хватит бесплатного; для TestFlight/App Store нужен Apple Developer, $99/год).
3. Node.js 20+ и Java не нужна.

## Шаги (в папке проекта)

```bash
npm install --no-audit --no-fund
npm run build
npx cap sync ios
cd ios/App && pod install && cd ../..
open ios/App/App.xcworkspace   # ВАЖНО: именно .xcworkspace, не .xcodeproj
```

## Подпись и запуск

1. В Xcode выбери проект App → Signing & Capabilities → Team (свой Apple ID),
   Bundle Identifier `com.anida.launcher` должен быть уникален — если занят,
   смени на `com.anida.launcher.<твоё-имя>` в этой же вкладке.
2. Подключи iPhone → выбери его сверху → Cmd+R. Готово, AniDa на телефоне.

## Файл .ipa (чтобы кидать другим)

Product → Archive → Distribute App → Ad Hoc (для своих устройств, нужно
зарегистрировать UDID) или App Store Connect / TestFlight.

## Без Mac (облако)

- **Codemagic** (codemagic.io): подключить репозиторий, выбрать iOS-раннер,
  добавить Apple Developer ключи — соберёт `.ipa` без своего мака.
- **GitHub Actions** (`macos-latest` раннер) + `apple-actions/import-codesign-certs`:
  тот же результат, нужен сертификат разработчика.
