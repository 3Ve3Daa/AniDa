# AniDa на iPhone без Mac — через облако

`.ipa` собирается на арендованном маке (Codemagic или GitHub Actions),
подписывается бесплатным Apple ID через Sideloadly и ставится на iPhone.
Проект уже полностью готов: `codemagic.yaml`, `.github/workflows/ios.yml`,
иконки, версия 1.1, Bundle ID `com.anida.launcher`.

## Шаг 0. Git (один раз)

Git сейчас ставится. Дальше в папке проекта:

```powershell
git init
git add .
git commit -m "AniDa 1.1.0"
```

## Шаг 1. Репозиторий на GitHub

1. Зарегистрируйся на github.com.
2. New repository → имя `anida`, **Private** (чтобы никто не видел код).
3. На странице репозитория GitHub покажет команды — выполни:
   ```powershell
   git remote add origin https://github.com/ТВОЙ-НИК/anida.git
   git branch -M main
   git push -u origin main
   ```

## Шаг 2. Сборка — вариант А: Codemagic (проще)

1. codemagic.io → Sign up через GitHub → Add application → выбери `anida`.
2. Тип проекта: **Capacitor** (или Other).
3. Нажми **Start new build** → workflow `ios-anida`.
4. Через ~10–15 минут забери `AniDa-unsigned.ipa` из Artifacts.

## Шаг 2. Сборка — вариант Б: GitHub Actions (без регистрации где-то ещё)

1. Залей код (шаг 1) — workflow уже лежит в `.github/workflows/ios.yml`.
2. Вкладка **Actions** → `AniDa iOS (unsigned)` → **Run workflow**.
3. После сборки забери `AniDa-unsigned-ipa` из Artifacts внизу страницы.

У GitHub на бесплатных аккаунтах мало минут macOS-раннеров, но на
1–2 сборки в месяц хватает. У Codemagic бесплатный тариф щедрее.

## Шаг 3. Подпись и установка (Sideloadly, бесплатно)

1. Поставь Sideloadly (sideloadly.io) на ПК, подключи iPhone кабелем,
   нажми Trust на телефоне.
2. В Sideloadly: перетащи `AniDa-unsigned.ipa`, введи свой Apple ID,
   нажми Start. Пароль приложения НЕ нужен — обычный пароль Apple ID
   (если спросит код 2FA — введи с экрана телефона).
3. На iPhone: Настройки → Основные → VPN и управление устройством →
   доверять своему Apple ID.
4. Готово — AniDa на домашнем экране. Бесплатный сертификат живёт 7 дней,
   потом повтори шаг 3 (2 минуты).

## Важно

- Это **unsigned** сборка: без Sideloadly/AltStore iPhone её не поставит.
- Хочешь без переподписи каждые 7 дней и TestFlight — нужен платный
  Apple Developer ($99/год): в `codemagic.yaml` есть готовый закомментированный
  workflow `ios-anida-signed` (раскомментировать, подключить Developer Portal).
- Bundle ID `com.anida.launcher` уже вшит; если будешь публиковать в App Store
  под своим аккаунтом и ID занят — смени в Xcode на `com.anida.launcher.<ник>`.
