<!-- Назначение файла: краткий план развития проекта. -->

# Дорожная карта проекта

1. Подготовка окружения: `.env` из `.env.example`, запуск Docker Compose
2. Развитие бота и мини‑приложения в каталоге `bot`
3. Автоматические тесты через `./scripts/setup_and_test.sh` локально и в CI
4. Аудит зависимостей командой `./scripts/audit_deps.sh`
5. Проверка MongoDB скриптом `check_mongo.cjs`, использование healthcheck в Docker
6. Поддержка pm2 6.0.8 и повторных подключений к базе
7. Настройка fork-режима pm2 для предотвращения ошибок polling
8. Синхронизация команд и сообщений скриптами при деплое
9. Расширение API и интерфейса по мере необходимости
10. Пагинация списка задач для уменьшения нагрузки на клиент
11. Автоматическое формирование `slug` для человекочитаемого URL
12. Улучшение SEO и доступности (robots.txt, aria‑label, meta description)
13. Расширенная модель задачи с логистикой, закупками и работами
14. Поддержка enum-полей для типов транспорта, оплаты и статусов
15. CRUD-эндпойнты `/api/v1/tasks` с полной формой заявки
16. Учёт этих полей в веб-клиенте и контроллерах
17. Справочники значений (`/api/v1/defaults`, `/api/v1/transports`) и страница редактирования
18. Ограничение запросов к справочникам и защита от инъекций
19. Редактирование отделов через `/api/v1/departments` и страницу `/defaults`; имена проходят проверку типа
20. Улучшение интерфейса управления заявками
21. Расширение enum-значений: добавлены "Построить", "Починить" и "Без оплаты"
21. Уточнение документации о допустимых значениях `task_type`
22. Унификация формы создания и редактирования задач
23. Везде использовать идентификатор вида `ERM_000001` и добавлять его к названию
24. Форма задач: сначала статус и приоритет, контролёр допускает несколько значений
25. Кнопки "Карта" показывают Google Maps с центром в Одессе
26. Бот отвечает полной ссылкой и координатами на короткие URL Google Maps
26. Исполнители и контролёр добавляются из выпадающего списка через кнопку «+»
27. Поле ввода ссылки на карту скрывается после вставки, показывается адрес
28. Координаты сохраняются в `startCoordinates` и `finishCoordinates`
29. В форме под ссылкой отображаются координаты
30. Форма выравнивается слева и растягивается на всю ширину
31. Выпадающие списки упоминаний удалены
32. Унифицирован префикс /api/v1 во всех запросах клиента
33. Интеграция React Quill и TelegramUI через @telegram-apps/sdk-react
34. Запуск мини-приложения в браузере по флагу `?browser=1`; кнопка «Браузер» ведёт на `https://agromarket.up.railway.app/?browser=1`
35. Клиент автоматически выбирает режим работы при отсутствии `Telegram.WebApp`

