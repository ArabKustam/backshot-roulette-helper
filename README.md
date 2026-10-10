# 🎯 Buckshot Roulette Helper

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.0-rusty_orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Стратегический калькулятор вероятностей для игры Buckshot Roulette**

[🎮 Live Demo](https://ArabKustam.github.io/backshot-roulette-helper) · [🐛 Report Bug](../../issues) · [💡 Request Feature](../../issues)

</div>

---

## 📖 Описание

**Buckshot Roulette Helper** — это интерактивный веб-инструмент для расчёта вероятностей и получения тактических рекомендаций во время игры в Buckshot Roulette. Приложение помогает принимать оптимальные решения, анализируя текущую ситуацию на основе известных данных о патронах.

### ✨ Возможности

- 🔴 **Расчёт вероятностей** — мгновенный анализ шансов боевого/холостого патрона
- 🎛️ **Chamber Timeline** — визуальное отслеживание позиций патронов в магазине
- 🎯 **Тактические рекомендации** — AI-подсказки: стрелять в себя или противника
- 👥 **Мультиплеерная поддержка** — до 4 игроков с индивидуальными HP и навыками
- 🔊 **Звуковые эффекты** — иммерсивные звуки click, load, eject (WAV)
- 💀 **CRT-эффекты** — ретро-стилизация интерфейса с глитч-эффектами
- 📱 **Адаптивный дизайн** — работает на всех устройствах

---

## 🛠️ Технологии

| Технология | Описание |
|-----------|----------|
| **React 19** | UI-библиотека |
| **TypeScript** | Типизация |
| **Vite** | Сборщик и dev-сервер |
| **TailwindCSS** | Утилитарный CSS-фреймворк |
| **Framer Motion** | Анимации |
| **Howler.js** | Звуковые эффекты |
| **Lucide React** | Иконки |

---

## 🚀 Быстрый старт

### Требования

- **Node.js** 18+ 
- **npm** или **yarn**

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/ArabKustam/backshot-roulette-helper.git

# Переход в директорию
cd backshot-roulette-helper

# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### Сборка для продакшена

```bash
npm run build
npm run preview
```

---

## 📂 Структура проекта

```
backshot-roulette-helper/
├── 📁 public/
│   └── 📁 sounds/           # Звуковые файлы (WAV)
│       ├── click.wav
│       ├── eject.wav
│       └── load.wav
├── 📁 src/
│   ├── 📁 components/       # React компоненты
│   │   ├── ChamberTimeline.tsx
│   │   ├── PlayerCard.tsx
│   │   ├── RollingCounter.tsx
│   │   └── ShellRating.tsx
│   ├── 📁 lib/              # Логика и утилиты
│   │   ├── chamber.ts       # Логика магазина
│   │   ├── solver.ts        # Расчёт вероятностей
│   │   └── types.ts         # Типы TypeScript
│   ├── App.tsx              # Главный компонент
│   ├── index.css            # Глобальные стили + CRT эффекты
│   └── main.tsx             # Точка входа
├── 📄 index.html
├── 📄 package.json
├── 📄 tailwind.config.js
├── 📄 vite.config.js
└── 📄 README.md
```

---

## 🎮 Как пользоваться

1. **Настройте патроны** — укажите количество боевых (LIVE) и холостых (BLANK) патронов
2. **Нажмите START ROUND** — начните отслеживание раунда
3. **Отмечайте известные патроны** — кликните на позицию в Chamber Timeline и выберите тип
4. **Следуйте рекомендациям** — система подскажет оптимальное действие
5. **Управляйте игроками** — добавляйте противников, меняйте HP

### Клавиши

- 🔊 **Volume** — включить/выключить звуки
- 🔄 **Reset** — сбросить конфигурацию
- ➕ **Add Opponent** — добавить игрока

---

## 🔊 Звуковые файлы

Проект использует WAV-файлы для звуковых эффектов:

| Файл | Описание |
|------|----------|
| `click.wav` | Клик по элементам интерфейса |
| `load.wav` | Загрузка патрона |
| `eject.wav` | Извлечение патрона |

> ⚠️ **Примечание**: Звуки отключены по умолчанию для соответствия политикам автовоспроизведения браузеров. Нажмите на иконку 🔊 чтобы включить.

---

## 📤 Инструкция по обновлению Git-репозитория

Если репозиторий уже существует на GitHub, но без звуков и README:

```bash
# 1. Добавить звуковые файлы в public/sounds (если ещё не добавлены)
# Скопируйте .wav файлы в папку public/sounds/

# 2. Проверить статус изменений
git status

# 3. Добавить все новые файлы
git add .

# 4. Создать коммит
git commit -m "feat: add sound effects (WAV) and professional README"

# 5. Запушить изменения
git push origin main
```

### Если нужно полностью перезалить репозиторий:

```bash
# 1. Удалить старую историю и начать заново (ОСТОРОЖНО!)
rm -rf .git

# 2. Инициализировать новый репозиторий
git init

# 3. Добавить все файлы
git add .

# 4. Создать первый коммит
git commit -m "🎯 Initial commit: Buckshot Roulette Helper v1.1.0"

# 5. Добавить remote (замените URL на ваш)
git remote add origin https://github.com/ArabKustam/backshot-roulette-helper.git

# 6. Принудительный push (перезапишет всё на GitHub)
git push -u origin main --force
```

> ⚠️ **Предупреждение**: `--force` удалит всю историю коммитов на GitHub!

---

## 🌐 Деплой на GitHub Pages

### Автоматический деплой (GitHub Actions)

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Настройка vite.config.js для GitHub Pages

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/backshot-roulette-helper/', // Имя вашего репозитория
})
```

---

## 📜 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

---

## 🤝 Вклад в проект

Contributions приветствуются! Пожалуйста:

1. Сделайте Fork проекта
2. Создайте ветку для фичи (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📞 Контакты

Если у вас есть вопросы или предложения, создайте [Issue](../../issues).

---

<div align="center">

**Сделано с ❤️ для сообщества Buckshot Roulette**

⭐ Если проект был полезен — поставьте звезду!

</div>


 
<!-- cleanup: minor code tweak -->
