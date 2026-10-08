# builds/ — технические артефакты сборок
# Готовые установщики лежат в ../AniDa-Apps/ (одна папка: .exe + .apk)

- `desktop/` — промежуточные файлы electron-builder (номер версии/блокмапы;
  сам `.exe` антивирус не даёт класть в эту синхронизируемую папку).
- `android/` — `app-debug.apk`: собрать `cd android && ./gradlew assembleDebug`
  (нужны Android SDK + JDK 17), затем скопировать APK в `../AniDa-Apps/`.
- `ios/` — на Windows собрать `.ipa` НЕВОЗМОЖНО (нужны macOS + Xcode).
  Готовый проект лежит в `../ios/`: открыть `ios/App/App.xcworkspace` на Mac,
  выбрать схему `App` → `Product → Archive`.

Discord Application ID: 1556678610407133264 (вшит в `electron/main.js`,
можно переопределить env `ANIDA_DISCORD_CLIENT_ID`).
