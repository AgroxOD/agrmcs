<!-- Назначение файла: план развития проекта. -->

# Дорожная карта проекта


Каталог `bot` содержит основную логику Telegram‑бота и мини‑приложение. Каталог `bot_old` хранится для истории.
Каталог `admin` удалён, весь функционал реализован в мини‑приложении.

Ниже описан общий план развития этих модулей.

## 1. Подготовительный этап

- Клонирование репозитория.
- Создание файла `.env` из примера; файл исключён из репозитория.
- Автоматизация генерации `.env` скриптом `create_env_from_exports.sh`, который
  берёт значения из текущего окружения и заполняет отсутствующие дефолтами из
  `.env.example`.
- Перед релизом обязательно измените `ADMIN_EMAIL` и `ADMIN_PASSWORD` на
  собственные значения: стандартные `admin@example.com` и `123456` подходят
  только для тестов.
- Обязательно задайте `APP_URL` c HTTPS, иначе Telegram не примет ссылку Web App.
- В README раздела «Установка» добавлено напоминание о запуске этого скрипта.
- Также в README описана проверка схем `APP_URL` и `MONGO_DATABASE_URL` в `bot/src/config.js`.
- `.env.example` содержит полный набор переменных для этого модуля.
- Внутри `.env.example` теперь приведены комментарии с описанием каждой переменной и источником её значения.

## 2. Интеграция

- Настройка общего Dockerfile и Compose для запуска обоих сервисов.
- По умолчанию Compose использует `bot/Dockerfile`, корневой `Dockerfile` предназначен для единой сборки.
- Проверка локального запуска, устранение ошибок сборки.
- При возникновении ошибки `lstat /client` убедитесь, что Docker собирает
  образ из каталога `bot` и в нём присутствует папка `client`.
- Переход на MongoDB Atlas для хранения данных.
- Интеграция с облачным хранилищем R2.

- Добавление нового функционала бота и мини‑приложения.
- Тестирование и оптимизация.

- Использование платформы [Railway](https://railway.com) для публикации сервисов.
- Установка нового CLI `@railway/cli` и проверка `railway status` перед каждым PR.
- При ошибке `connect ENETUNREACH` задавайте `HTTP_PROXY`/`HTTPS_PROXY` или скачивайте CLI с GitHub Releases.
- Конфигурация CI/CD (например, GitHub Actions).
- Добавить сборку фронтенда в Procfile, чтобы исключить ошибку 404 при деплое.
- В Vite задано `build.outDir: '../public'`, поэтому результирующие файлы сразу помещаются в `bot/public`.
- Проверять наличие каталога `bot/public` после сборки для устранения ошибки 404 на `/dashboard`.
- При пустой директории `bot/public` API теперь запускает `npm run build-client` автоматически.
- Docker автоматически запускает `npm run build-client`, но после изменений во фронтенде сборку следует повторить.
- При использовании Railway отслеживать логи на наличие 404 и в случае ошибки повторять `npm --prefix bot run build-client`.
- Если в логе сервиса виден запрос `GET /dashboard/` со статусом 404, это признак отсутствия статических файлов; выполните сборку повторно.
- После обновления зависимостей перед каждой сборкой интерфейса выполняйте `npm --prefix bot/web install`.
- Ту же команду запускайте перед проверкой `npm run lint --prefix bot/web`, чтобы исключить ошибки линтера.
- При возникновении предупреждений npm об устаревших пакетах обновляйте их сразу,
  чтобы избежать будущих конфликтов. Актуальные версии указаны в `package.json`.
- В `bot/web/next.config.ts` включите `trailingSlash`, чтобы страницы вроде `/dashboard` работали после обновления.
- Для диагностики сохраняйте вывод сборки:
  ```bash
  npm --prefix bot/web install > /tmp/npm_install.log 2>&1 && tail -n 20 /tmp/npm_install.log
  npm --prefix bot run build-client > /tmp/npm_build.log 2>&1 && tail -n 20 /tmp/npm_build.log
  # или ./scripts/build_client.sh
  ```

## В разработке
- Добавлен базовый workflow `ci.yml` для npm install и npm test.
- Файл `.dockerignore` теперь исключает `.env` и `.env.*` из контекста Docker.
- В `docker.yml` файл `.env` теперь создаётся из `.env.example` с подстановкой секретов перед тестами.
- Перед сборкой Docker в workflow выполняется `node scripts/check_mongo.cjs` для быстрой проверки подключения к MongoDB. Скрипт работает даже без установленного `dotenv` и ищет `mongoose` в `bot/node_modules`.
- При ошибке "bad auth" скрипт предлагает проверить логин и пароль в `MONGO_DATABASE_URL` и напоминает добавить их в строку подключения.
- Восстановлен скрипт `npm test` в `bot/package.json` вместе с зависимостями Jest.

- `/start` и `/app` отправляют кнопку «Открыть приложение». Ссылка
  формируется только для зарегистрированных пользователей.
- При регистрации выполняется `verifyUser`, дата сохраняется в поле `verified_at` и отображается в админ‑панели.
- Команда `/browser` выдаёт прямую ссылку на приложение для работы в обычном браузере.
- Команда `/help` показывает список всех доступных команд.

- Создан общий модуль `bot/src/db/queries.js` для работы с MongoDB.
- Добавлена карта запросов `docs/db_request_map.md`.
- Перенос фронтенда на React + Vite + Tailwind завершён.
- Tailwind config обновлён по шаблону TailAdmin 1.3, подключены все используемые шрифты.
- Обновлён плагин `@tailwindcss/postcss` до версии 4.1.11, что стабилизировало сборку CSS.
- Удалена директива `@custom-variant dark`, что исправило предупреждения esbuild при сборке стилей.
- Продолжается адаптация страниц под стиль TailAdmin, обновлена страница `Tasks` с таблицей и формой.
- Введена интеграция GatewayAPI: коды подтверждения отправляются через SMS или Telegram.
- Коды подтверждения содержат время генерации и очищаются через 5 минут, что повышает безопасность.
- При задании `WEBHOOK_URL` бот запускается в режиме webhook и регистрирует адрес через Bot API.
- Виджет Telegram Login обновлён до версии 22 и запрашивает доступ `write`.
- После создания задачи мини‑приложение вызывает `sendData('task_created:<id>')`,
  бот реагирует на `web_app_data` и подтверждает создание.
- Планировщик уведомлений использует очередь `p-queue` с лимитом 30 сообщений в секунду.
- README дополнен оглавлением, разделом «Возможности» и примером запроса к API.
- Бот делает три попытки переподключения к MongoDB, что помогает избежать ошибки `502` при первом деплое на Railway. Если статус не меняется, проверьте DNS кластера и переменную `MONGO_DATABASE_URL`.
- Форма создания задачи включает выбор стартовой и финальной точек на карте, список типов и упоминание пользователей Telegram.
- Форма создания задачи использует кнопку «Карта» для выбора стартовой и финальной точек. Скопированная ссылка «Поделиться» преобразуется в короткий адрес со ссылкой на Google Maps. Новые ссылки сохраняются в базе.
- В окне карты появилась подсказка о кнопке «Поделиться». Ссылка проверяется при подтверждении и при ошибке показывается сообщение.
- Для валидации ссылок Google Maps добавлена утилита `validateURL` с библиотекой `validator`.
- Мини‑карта загружается через ссылку `maps/embed`, Google не отправляет `X-Frame-Options`. В `helmet` прописан `frame-src https://www.google.com https://oauth.telegram.org`.
- Внедрено модальное окно просмотра и редактирования задачи, открывающееся по клику на название.
- Форма создания задачи дополнена выбором приоритета, автора, списка исполнителей и полем комментария с упоминанием групп и ролей.
- На страницах задач и в админ‑панели имена пользователей содержат ссылку `tg://user?id=<telegram_id>` для мгновенного перехода в чат.
- Команда `/create_task` корректно сохраняет задачи: поле `title` передаётся из текста сообщения, приоритет по умолчанию "В течении дня".
- Обновлены lock‑файлы фронтенда, `npm ci` больше не завершается ошибкой из‑за версии `yaml`.
- После создания задачи бот вызывает `createForumTopic` и записывает `telegram_topic_id`.
- При отсутствии названия бот выдаёт подсказку об обязательности аргумента.
- Команда `/list_tasks` сообщает «Нет задач», если пользователю нечего показать.
- Списки задач в чате оснащены кнопками "✔️" и "❌" для быстрого завершения или удаления.
- Команда `/task_menu` выводит inline-меню для просмотра задач и запуска приложения.
- В inline-режиме работают команды `add <текст>` и `search <ключ>`, первая создаёт задачу, вторая ищет до десяти задач.
- Файл `bot/src/messages.js` объединяет текстовые ответы, их можно обновлять скриптом `scripts/set_bot_messages.sh`.
- Формы пользователей и проектов переведены на компоненты TailAdmin, добавлены утилиты кнопок.
- Настроены Jest и Supertest, добавлена интеграция Husky с `eslint` и тестами.
- Для прохождения тестов обязательна переменная `APP_URL`, иначе Jest
  завершится ошибкой.
- Теперь переменные окружения устанавливаются в начале тестовых файлов,
  чтобы избежать сообщения `Переменная BOT_TOKEN не задана`.
- Подключён Swagger для генерации документации API.
- Запущен CI на GitHub Actions с проверкой линтера и тестов.
- Исправлены цвета текста событий календаря в тёмной теме.
- Компонент `Admin` переведён на TypeScript и использует контекст авторизации чер
  ез явный импорт.
- Регистрация теперь возможна только через Telegram и проверяется членство в группе.
  - Веб-интерфейс получил страницу `/login` с кнопкой Telegram Login. После
    подтверждения аккаунта сервер выдаёт JWT и пользователь попадает в приложение.
  - Для поддержки виджета Telegram дополнена CSP: `script-src https://telegram.org 'unsafe-eval'` и `media-src data:`.
- Добавлены отделы, привязанные к задачам и пользователям.
- В личном кабинете выводятся задачи, где пользователь упомянут.
- Исправлены цвета текста в выпадающих меню, хлебных крошках и вкладках при активной тёмной теме.
- Добавлены скрипты миграций и сидов MongoDB.
- Создана простая админ‑панель управления пользователями и логами.
- Скрипт миграций теперь удаляет старый индекс `email_1`,
  регистрация через `/register` использует upsert.
- Запросы к задачам централизованы в сервисе `bot/web/src/services/tasks.js`.
- Улучшено руководство `docs/telegram_bot_manual.md`: добавлены пошаговые инструкции по BotFather и получение текущего меню через API.
- В это же руководство включён раздел «Типовые ошибки API» с примером `Bad Request: message text is empty` и демонстрацией ответа бота после валидации.
- Цикл выполняется, пока средний уровень не превысит 99%.
- Подготовлено расширенное руководство по адаптации дизайна TailAdmin (docs/extended_tailadmin_guide.md).
- Команды `/assign_task`, `/upload_file` и `/edit_last` теперь проверяют наличие обязательных аргументов.
- `/assign_task` при одном аргументе использует кнопки `KeyboardButton.requestUser` и `KeyboardButton.requestChat` для выбора исполнителя или группы.
- Добавлены тесты `commandValidation` для проверки этих команд без аргументов.
- Загрузка файлов через `/upload_file` прикрепляет их к задаче и сохраняет ссылку в R2.
- Появилась команда `/upload_voice <taskId>` для загрузки голосовых сообщений в задачи.
- Регистрация через `/api/auth/register` сразу выдаёт JWT,
  интеграционные тесты покрывают оба маршрута регистрации и входа.
- Бот отправляет ссылку на мини‑приложение после `/start`,
  команда `/app` остаётся опциональной.
- При ошибке `BUTTON_TYPE_INVALID` ссылка повторяется обычной
  кнопкой URL без Web App.
- Разработан Figma-документ, полностью повторяющий TailAdmin, см. `docs/tailadmin_figma_design.md`.
- Сам файл `TailAdminDesign.fig` хранится в каталоге `docs` и применяется при верстке.
  Дизайн включает светлую и тёмную темы, компоненты оформлены как Variants в Figma.
  Файл в репозитории является заглушкой; полная версия дизайна доступна во внешнем хранилище.
- В ходе обновления зависимостей устранены предупреждения npm об устаревших
  модулях, включая `lodash.isequal` и `glob`.
- Планировщик `scheduler.js` раз в минуту проверяет поле `remind_at` у задач и присылает уведомление. Запуск происходит только вне режима test, остановить его можно функцией `stopScheduler()`.
- Напоминания рассылаются каждому исполнителю из `assigned_user_id` и `assignees`, если в профиле установлен флаг «получать напоминания». При отсутствии таких пользователей сообщение отправляется в чат отдела.
- Расширена валидация API и добавлены разделы "Логи" и "Роли" во фронтенде.
- Для раздела "Роли" реализована форма создания роли, страница "Логи" выводит последние события из MongoDB.
- Интерфейс страницы `Роли` приведён к стилю TailAdmin.
- Добавлена переменная `BOT_API_URL` для работы через локальный сервер Telegram Bot API и возможность загружать файлы объёмом до 2 ГБ.
- Продолжается работа над мелкими элементами TailAdmin: добавлены dropdown меню профиля, вкладки, пагинация и breadcrumbs.
- В Header при отсутствии токена показывается кнопка «Войти», иначе меню профиля.
- На Dashboard добавлены skeleton‑карточки и плавная загрузка таблицы последних задач.
- Добавлен контекст Toast и компонент `Toasts` для одновременного отображения нескольких уведомлений.
- Исправлена регистрация через Telegram: поле `email` теперь генерируется автоматически
  в формате `<telegram_id>@telegram.local`, что устранило конфликт уникального индекса.
- Базовая конфигурация ESLint размещена в `eslint.config.js`, команды `npx eslint bot/src` проверяют серверный код.
- При ошибке `Cannot find module '@eslint/js'` перед запуском линтера выполняйте `npm --prefix bot install`.
- Для фронтенда подключён `@typescript-eslint/eslint-plugin` и парсер,
  маска файлов линтера охватывает `**/*.{js,jsx,ts,tsx}`.
- Для воспроизводимой установки используйте `npm ci --prefix bot`. При отсутствии `package-lock.json` запустите `npm --prefix bot install` для его создания. После установки выполняйте `npm audit fix --prefix bot` или скрипт `scripts/install_bot_deps.sh`.
- В API добавлены `helmet`, `cors` и проверка полей через `express-validator`.
- Маршруты регистрации и входа теперь валидируют данные через `express-validator`.
- Реализован fallback маршрута `app.get('/{*splat}')` для корректной работы SPA.
- Убраны устаревшие маршруты `/tasks`; путь к задачам только `/api/tasks`, что
  устранило ошибку `{"message":"No token provided"}` при перезагрузке страниц.
- Для этого маршрута добавлен rate limiter во избежание атак.
- Маршрут `/api/tasks/:id` также имеет лимит 100 запросов за 15 минут.
- Путь `/api/auth/login` допускает 5 попыток в минуту для защиты от брутфорса.
- Маршруты `/api/groups`, `/api/users`, `/api/roles`, `/api/logs` и
  `/api/tasks/:id/status` ограничены тем же лимитом 100 запросов за 15 минут.
- Для чтения переменных окружения создан модуль `bot/src/config.js`.
- В модуле добавлена проверка `MONGO_DATABASE_URL` на корректный протокол,
  чтобы деплой не падал из-за опечаток в строке подключения.
- Подключение к MongoDB вынесено в `bot/src/db/connection.js` с пулом соединений.
- Устаревшие опции `useNewUrlParser` и `useUnifiedTopology` убраны из подключения
  к базе, чтобы драйвер не выводил предупреждения.
- Для PostCSS в React‑фронтенде используется плагин `@tailwindcss/postcss`.
- Во фронтенд добавлен Prettier и градиентный фон из шаблона React Vite Tailwind.
- Подготовлена инструкция `docs/dashboard_tailadmin.md` по применению стилей TailAdmin для страницы Dashboard.
- В интерфейс интегрирован дизайн TailAdmin: появились страницы "Проекты", "Отчёты" и "Профиль", сохранён компонент NotificationBar.
- NotificationBar дополнен иконкой и кнопкой закрытия, график TasksChart использует фирменные цвета и поддерживает тёмный режим.
- Стили синхронизированы с проектом TailAdmin React; архив удалён из репозитория.
- Улучшены страницы входа, регистрации и профиля, логика вынесена в контекст AuthContext.
- Формы входа и регистрации отображают спиннер загрузки и выводят ошибки через Toast.
- Добавлена доска Kanban для задач с drag&drop.
- Исправлена ошибка линтера в компоненте Kanban.
- Статусы задач приведены к `new/in-progress/done`, что устраняет 500 ошибки.
- Все тесты и линтер выполняются без ошибок.
- Добавлены тесты `kanbanStatus` и `authRole` для проверки статуса задач и ролей.
- В AuthContext при ошибке запроса профиля токен стирается из `localStorage`,
  чтобы избежать постоянных 401 и переадресовать пользователя на логин.
- При ответе 401 или 403 на `/api/tasks` пользователь переходит на страницу входа.
- Drag&drop переведён на `@hello-pangea/dnd` с поддержкой React 19.
- Реализована страница `Task List` по адресу `/tasks`, дизайн повторяет демо TailAdmin.
- На страницах "Админ", "Проекты" и "Отчёты" добавить формы для создания пользователей,
  групп и фильтрации отчётов.
- Эти страницы оформлены карточками TailAdmin, сверху отображаются breadcrumbs.
- Breadcrumbs внедрены на Dashboard, странице профиля и отчётов.
- Добавлено выпадающее меню уведомлений в шапке.
- Настроен релизный workflow с Docker-сборкой и командой `railway up`.
- Добавлен скрипт `scripts/audit_dependencies.sh` для `npm audit` и `npm outdated`.
- При появлении предупреждений GitHub обновляем зависимости командой
  `npm --prefix bot audit fix --force` и проверяем `npm --prefix bot outdated`.
- При установке зависимостей используем `npm ci --prefix bot || npm --prefix bot install`, затем `npm audit fix --prefix bot` или используем скрипт `scripts/install_bot_deps.sh`.
- Расширяем документацию по сценарию использования API.
- Настроен workflow `release.yml` для автоматических GitHub Releases.
- Добавлен маршрут `/api/tasks/:id` для получения одной задачи.
- Реализован метод `DELETE /api/tasks/:id` и кнопка удаления задачи в интерфейсе.
- Обновлены ссылки на workflow Docker и Release в README.
- Маршруты `/groups`, `/users`, `/roles` и `/logs` перенесены под префикс `/api`.
- Статус задач изменяется через `/api/tasks/:id/status`.
- Добавлен шаблон pull request и файл CODEOWNERS.
- Создан issue template `task.yml` для универсальных задач.
- В модель пользователя добавлено поле `roleId`, права проверяет middleware `checkRole`, роль выбирается при создании пользователя.
- Интегрируем дополнительные возможности Telegram Bot API через `telegramApi.js`.
- Подготовлена инструкция по настройке бота через BotFather и добавлен скрипт `scripts/set_bot_commands.sh` для загрузки команд.
- Бот через команду `/start` автоматически создаёт пользователя в базе и предоставляет админам команды `/list_users` и `/add_user`.
- Коллекция пользователей бота переименована в `telegram_users`,
  что устранило ошибку уникального индекса `email` при регистрации.
- Описаны лучшие практики CI/CD в разделе README.
- Во фронтенд добавлены компоненты Sidebar, Header и DashboardPage из TailAdmin на TypeScript.
- Настроен TypeScript в каталоге `bot/web` и подключён tsconfig.
- Оставшиеся файлы `.jsx` в `bot/web/src` переведены в `.tsx`.
- Интерфейс полностью адаптирован к дизайну TailAdmin с использованием `@heroicons/react`.
- Для стабильной работы React добавлена зависимость `@heroicons/react` и проверка наличия элемента `#root` в `main.tsx`.
- Исправлена ошибка `Minified React error #130`: элементы меню теперь содержат поле `icon`.
- Dashboard отображает метрики задач и график активности за неделю.
- Интегрирован полноценный Dashboard с KPI‑карточками, графиком и таблицей последних задач.
- Реализован модуль задач с чеклистами, тайм‑трекером и KPI.
- Отчёты KPI поддерживают фильтр по дате через `from` и `to`.
- Введён контроллер `reportController.js` для агрегирования отчётов.
- Добавлена система регистрации и входа пользователей, страница профиля на React.
- Настроен workflow `ci.yml` с MongoDB для проверки серверных и фронтенд тестов.
- В нём для бэкенда используется `./scripts/install_bot_deps.sh`.
- Написаны тесты безопасности и проверки rate limit для маршрутов API.

## 5. Отслеживание версий

- Для каждой версии фиксировать изменения в файле `CHANGELOG.md`.
- Помечать релизы git-тегами вида `vX.Y.Z`.

## 6. Документация и безопасность

- После релиза обновлять `README.md` и `SECURITY.md`.
- Проверять конфигурацию `docker-compose.yml` командой `docker compose config`.
- Перед этим убедитесь, что создан файл `.env`, иначе проверка завершится ошибкой.

## 7. Поддержка зависимостей

- Периодически выполнять `npm audit` и `npm outdated` для модуля `bot`.
- Обновлять пакеты после успешного прохождения тестов.
- В актуальной версии обновлены `@aws-sdk/client-s3` и `jest`.
- Также обновлены транзитивные зависимости, чтобы убрать предупреждения npm о пакетах `lodash.isequal`, `lodash.get`, `inflight` и `glob`.
- Для полного устранения предупреждения `inflight` добавлен override `glob@11` в `bot/package.json`.
- В `bot/web/package.json` заданы override `rimraf@6` и `uuid@9`, чтобы исключить соответствующие предупреждения npm.
- Использовать скрипт `scripts/audit_dependencies.sh` для автоматизации проверки.
- При обнаружении уязвимостей запускать `npm audit fix --prefix bot`. Используйте также `scripts/install_bot_deps.sh` для установки.
- При возникновении ошибок сети при обращении к `nextjs.org` убедитесь в наличии интернет‑доступа или настройте прокси.
- Если `npm` выводит предупреждение `Unknown env config "http-proxy"`, его можно игнорировать либо удалить переменные `http_proxy` и `https_proxy` из окружения.

- Добавлена документация с результатами Lighthouse (docs/lighthouse_20250624.md).
- Добавлен свежий отчёт Lighthouse за 26.06.2025 (docs/lighthouse_20250626.md).
- Разработан `ToastProvider` для отображения стека уведомлений во фронтенде.
- Обновлён `bot/web/package-lock.json`, ошибка `npm ci` из-за отсутстсвия validator устранена.
- Внедрён общий helper authFetch, предотвращающий ошибку 'No token provided' при обновлении страниц.
- Фронтенд разбит на чанки через `React.lazy`, что уменьшило размер главного бандла.
- Исправлены предупреждения React Hooks на Dashboard и TasksPage.
- Переключение светлой и тёмной темы теперь учитывает системную настройку браузера.
- В index.html подключён скрипт `theme.js`, который добавляет класс `dark` перед инициализацией React, устраняя мерцание и обходя ограничения CSP.
- Проверено подключение к кластеру `arjs-db.4pzoyda.mongodb.net` с базой `agromarket`; для проверки используется скрипт `scripts/check_db_fetch.cjs`.
- Добавлен скрипт `scripts/check_mongo.cjs` для быстрого ping к MongoDB. При отсутствии `dotenv` он считывает `.env` самостоятельно и ищет `mongoose` в `bot/node_modules`.
- При смене строки подключения из Railway проверяйте его запуском `node scripts/check_mongo.cjs`; при ошибке `ENETUNREACH` настройте прокси.
- Для обновления меню команд используется `scripts/set_bot_commands.sh`,
  конфигурация хранится в `scripts/bot_commands.json`.
- Добавлена возможность сворачивать Sidebar на десктопе до узкой панели.
- Цветовая схема унифицирована: добавлены акценты `accentPrimary` и `accentSecondary`,
  а также четыре нейтральных оттенка `neutral-100`, `neutral-300`, `neutral-500`,
  `neutral-900`.


- Добавлен скрипт `scripts/get_menu_button_url.js` для проверки URL кнопки меню.
Пример вывода без действующего токена:
```
Ошибка: request to https://api.telegram.org/botyour_bot_token/getChatMenuButton failed, reason:
```
- Для обновления ссылки на приложение используется `scripts/set_menu_button_url.js`.
- При включённом Attachment Menu URL обновляется командой `npm run menu:update`, страница выбора задач доступна по `/menu`.
- Поддержаны глубокие ссылки `/start`: `task_<id>` открывает задачу, а `invite_<departmentId>` добавляет пользователя в отдел.
- В начало ключевых файлов добавлены строки с назначением: `docs/dashboard_tailadmin.md`, `docs/lighthouse_20250624.md`, `docs/lighthouse_20250626.md`, `bot/web/README.md`.
- В этот файл также добавлены опции `moduleResolution: node` и `types: ['node']`, что позволило успешно компилировать CLI.
- Мини-приложение теперь работает только в светлой теме, стили собираются с
  `autoprefixer` для кросс-браузерности.
- При деплое проверяйте `VITE_BOT_USERNAME`, иначе Telegram Login выдаст ошибку `Username invalid`.
 - Проверяйте целостность `bot/web/package-lock.json`, иначе `npm ci` не выполнится в Docker.
 - При повреждении lock-файла пересоздайте его командой `npm --prefix bot/web install` перед сборкой.
- Переменные VITE_TELEGRAM_API_ID и VITE_TELEGRAM_API_HASH зарезервированы для будущей интеграции с TDLib.
- Страница `/chats` подключает TDLib через файлы из `bot/web/public/tdlib`. Скрипт `scripts/setup_tdweb.sh` устанавливает их автоматически.
- При старте API проверяется `bot/public/index.html`. Если файла нет или он пустой,
  запускается сборка фронтенда `npm run build-client`.
- Railway предоставляет плагин MongoDB с готовой строкой подключения.
- В README приведён пример домена `mongodb-production-2083.up.railway.app:27017`.
