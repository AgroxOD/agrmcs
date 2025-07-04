#!/usr/bin/env bash
# Назначение: установка зависимостей и запуск тестов с линтерами.
# Модули: bash, npm, docker.
set -euo pipefail
cd "$(dirname "$0")/.."

# Создаём .env из шаблона, если отсутствует
if [ ! -f .env ]; then
  ./scripts/create_env_from_exports.sh
fi

# Устанавливаем зависимости бота и клиента
npm ci --prefix bot || npm --prefix bot install
npm ci --prefix bot/web || npm --prefix bot/web install

# Запускаем тесты и линтеры
npm test --prefix bot -- --detectOpenHandles
npx eslint bot/src
npm run lint --prefix bot/web

# Проверяем конфигурацию docker compose при наличии
if [ -f docker-compose.yml ]; then
  docker compose config >/dev/null
fi
