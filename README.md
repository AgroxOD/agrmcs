<!-- Назначение файла: документация проекта и общие инструкции. -->
# Telegram Task Manager Bot + Mini App

Файл описывает проект и способы его развертывания.

Каталог `bot` содержит код бота и статическое мини-приложение Telegram.
Для сборки используется один `Dockerfile`. Мини‑приложение запускается ботом и содержит веб‑интерфейс управления.

Дополнительная информация о плане разработки представлена в файле `ROADMAP.md` (включая раздел «В разработке»), а история изменений ведётся в `CHANGELOG.md`.
За инструкцией по настройке команд и вебхуков бота обратитесь к файлу `docs/telegram_bot_manual.md`.

## Быстрый старт

### Требования
- Docker и Docker Compose
- Учётная запись MongoDB Atlas

### Локальный запуск
1. Склонируйте текущий репозиторий с модифицированным кодом:
   ```bash
   git clone https://github.com/AgroxOD/agrmcs.git
   ```
   Каталог `bot` уже содержит необходимые исходники.
2. Создайте файл `.env` на основе примера или существующих переменных окружения.
   Копирование примера:
   ```bash
   cp .env.example .env
   ```
   Автоматическая генерация:
   ```bash
   ./scripts/create_env_from_exports.sh
   ```
   Скрипт берёт список ключей из `.env.example`, подставляет значения из текущего
   окружения или оставляет дефолтные и создаёт файл.
   `.env` не хранится в репозитории и перечислен в `.gitignore`.
 Для входа в мини‑приложение задайте `ADMIN_EMAIL` и `ADMIN_PASSWORD`.
 Перед запуском можно проверить конфигурацию командой `docker compose config`. Без созданного `.env` она выдаст ошибку о его отсутствии.
3. В переменную `CHAT_ID` запишите ID чата для уведомлений. Его можно узнать через бота `@userinfobot`.
4. Запустите контейнеры:
  ```bash
  docker compose up --build
  ```
  Compose соберёт образ бота и запустит MongoDB.
  Мини‑приложение открывается ссылкой из команды `/app`.
  После входа на `/login` страница `/dashboard/tasks` загружает задачи из MongoDB.
  Маршрут авторизации `/api/auth/login` ограничен частотой запросов.
  Для проверки сервера запросите GET `/health`.
  При занятости порта 3000 укажите другой `HOST_PORT` в `.env`.
  Чтобы остановить сервисы, выполните `docker compose down`.

При необходимости можно собрать единый образ из корневого `Dockerfile`. Используется многоступенчатая сборка для уменьшения размера:
```bash
docker build -t task-manager .
docker run --env-file .env -p ${HOST_PORT:-3000}:${PORT:-3000} task-manager
```

### Развёртывание на [Railway](https://railway.app)
1. Создайте новый проект и подключите репозиторий.
2. Выберите Node `20` или совместимую версию.
3. В настройках задайте переменные из `.env.example`.
4. Railway автоматически использует `Procfile` из корня. В нём теперь выполняется
   сборка интерфейса перед стартом, что предотвращает ошибку `404` на `/dashboard`.
5. Нажмите Deploy и дождитесь запуска контейнера.

## Структура проекта
```
project-root/
├── ROADMAP.md          # план разработки
├── CHANGELOG.md        # история версий
├── bot/                # исходный код Telegram-бота
│   └── Dockerfile      # контейнер бота
├── .env.example        # пример переменных
├── .env                # локальные переменные (не добавляйте в git)
├── docker-compose.yml  # локальное развертывание
└── README.md           # документация
```

## Лицензия
Проект распространяется под лицензией MIT.

## CI с Docker
Файл `.github/workflows/docker.yml` проверяет `docker-compose.yml` и собирает образы с помощью `docker compose` при каждом pull request.

## Внесение вклада
Перед разработкой создайте задачу через шаблон в `.github/ISSUE_TEMPLATE` и изучите [CONTRIBUTING.md](CONTRIBUTING.md). При каждом изменении обновляйте документацию и `CHANGELOG.md`.

## Безопасность
Файл `.env` содержит секреты и предназначен только для локальной разработки.
Создайте его на основе `.env.example` и не публикуйте в репозитории.
Для продакшена рекомендуем использовать Docker Secrets или сторонние хранилища
секретов, например [Vault](https://www.vaultproject.io/).

## Резервное копирование БД в R2
Для создания архива MongoDB и загрузки его в R2 выполните:
```bash
./scripts/backup_mongo_r2.sh
```
Скрипт использует переменные из `.env` и требует установленный `aws` CLI.

### Ошибка 404 на `/dashboard`
Если в логах появляется ответ `404` на `GET /dashboard/` или `/dashboard/tables`, значит статический интерфейс не сгенерирован. Выполните сборку фронтенда:
```bash
npm --prefix bot run build-client > /tmp/npm_build.log 2>&1 && tail -n 20 /tmp/npm_build.log
```
Или воспользуйтесь скриптом:
```bash
./scripts/build_client.sh
```
Если команда завершается ошибкой `next: not found`, сначала установите зависимости:
```bash
npm --prefix bot/client install > /tmp/npm_install.log 2>&1 && tail -n 20 /tmp/npm_install.log
```
Затем повторите сборку. Убедитесь, что каталог `bot/public` содержит статические файлы, и проверьте логи сервиса на отсутствие ответов `404`.
При пустой директории `bot/public` сервер при старте выполнит сборку сам, но для актуализации интерфейса лучше запускать `npm --prefix bot run build-client` вручную.
После обновления зависимостей рекомендуется снова выполнить `npm --prefix bot/client install` и `npm --prefix bot run build-client`.
Для корректной работы маршрутов после обновления страницы в файле
`bot/client/next.config.ts` активирована опция `trailingSlash`, создающая каталоги
с `index.html`. Благодаря этому путь `/dashboard` отвечает без ошибки 404 при
прямом обращении.
Если в процессе установки или сборки появляются ошибки, связанные с недоступностью `nextjs.org`, это означает блокировку домена в текущей среде.
Используйте прокси или окружение с открытым доступом к сети, иначе `npm` не сможет загрузить необходимые пакеты.
Если при установке выводится предупреждение `Unknown env config "http-proxy"`,
замените переменную окружения `http-proxy` на `HTTP_PROXY` или `npm_config_proxy`.



## Обзор текущего состояния

### Плюсы
- Чёткая бизнес-логика агро-операций и пользователей, всё доступно через REST API.
- Проект докеризирован: `Dockerfile` и `docker-compose.yml` ускоряют запуск.
- Пример `.env` и краткое руководство в README.
- Код разделён по слоям: роуты, модели, контроллеры.
- Интерфейс содержит страницу `/dashboard/tasks`, загружающую данные из MongoDB.
- Теперь на этой странице есть форма добавления задач через API.
- При создании задачи выводится уведомление об успешном добавлении.
- Общая утилита `api.ts` выполняет вход и загрузку задач через API.

### Минусы
- Интерфейс построен на устаревших Bootstrap и jQuery.
- Валидация данных минимальна, API легко сломать неверными запросами.
- Отсутствуют средства защиты (helmet, cors, лимитеры).
- Нет unit или интеграционных тестов.
- CI/CD не покрывает форматирование и тесты.
- Недостаточно описана документация API и ролей.
- Нет скриптов миграций и наполнения тестовыми данными.

### Как улучшить
- Переписать фронтенд на React с Vite и Tailwind либо shadcn/ui.
- Добавить Jest/Supertest и линтер с Husky.
- Описать примеры API и бизнес-процессы, подключить Swagger/OpenAPI.
- Настроить CI в GitHub Actions.
- Реализовать dev-скрипты, миграции и сиды для MongoDB.
- Создать админ‑панель для управления пользователями и логами.

### Итог
Проект представляет готовую базу и быстро разворачивается, но требует модернизации для полноценного продакшна.
