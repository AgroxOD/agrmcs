🧠 Инструкции для Codex

- Документация и комментарии пишутся только по‑русски
- В начале каждого файла указывайте назначение и основные модули
- Текстовые сообщения бота в `bot/src/messages.js` должны быть на русском
- Код делайте лаконичным и понятным
- При выборе точки на карте сохраняйте координаты из ссылки

✅ Тесты
- Перед коммитом запускайте `./scripts/setup_and_test.sh`
- Проверяйте зависимости командой `./scripts/audit_deps.sh`
- При отсутствии `.env` используйте `./scripts/create_env_from_exports.sh`
- Если есть `docker-compose.yml`, выполняйте `docker compose config`

📄 Документация
- При изменениях обновляйте README.md, CHANGELOG.md, ROADMAP.md и AGENTS.md
- Каталог `bot` содержит сервер и веб‑интерфейс
- Веб-клиент использует meta description и файл `robots.txt` для SEO
- `.env.example` использует подключение `mongodb://admin:admin@localhost:27017/ermdb?authSource=admin`
- Для GitHub Actions требуется собственный MongoDB-хост или Railway CLI
- Рекомендуется проверять базу командой `npm --prefix bot run check:mongo`
- Переменная `BOT_API_URL` позволяет использовать локальный telegram-bot-api
- Docker Compose содержит healthcheck для MongoDB
- Добавлена пагинация списка задач в API
- В задачи добавлено поле `slug`
- Модель задачи расширена секциями логистики, закупок и работ
- Поддерживаются enum-поля `transport_type`, `payment_method`, `priority`, `status`
- В списки enum добавлены значения "Построить", "Починить" и "Без оплаты"
- CRUD-маршруты `/api/v1/tasks` возвращают и создают такие задачи
- Для редактирования значений enum есть коллекции `DefaultValue` и `Transport`,
  эндпойнты `/api/v1/defaults/:name` и `/api/v1/transports`
- Для них действует rate limit и проверка входных данных
- Отделы редактируются через `/api/v1/departments` и страницу `/defaults`
- При обновлении отдела имя проверяется на тип строки для защиты от инъекций
- pm2 переведён в fork-режим, чтобы исключить конфликт polling
- Добавлены значения enum: "Построить", "Починить" и "Без оплаты"
- Форма задач единая для создания и редактирования
- Название задачи начинается с идентификатора формата `ERM_000001`
- Поле "Ответственный" убрано, "Контролёр" допускает несколько пользователей
- Поля формы расположены по порядку: статус, приоритет, отдел и т.д.
- Кнопки "Карта" открывают окно Google Maps с Одессой по умолчанию
- Бот разворачивает короткие ссылки Google Maps
- Исполнител(и)ь и Контролёр выбираются из списка, можно добавлять несколько через «+»
- Форма выравнивается слева и занимает всю ширину окна
- Координаты показываются под ссылкой после вставки
- Списки «@ упомянуть» удалены из формы
- Мини-приложение использует React Quill и TelegramUI
- Запуск в браузере по флагу `?browser=1` без telegram-apps-sdk
- Кнопка «Браузер» ведёт на `https://agromarket.up.railway.app/?browser=1`
- Если объект `Telegram.WebApp` не определён, клиент автоматически переходит в режим браузера


