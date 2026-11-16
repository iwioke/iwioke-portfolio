> **Superseded (16 Nov 2026):** the English-only "night valley" reconstruction is documented in `docs/night-valley-reconstruction/`. This file describes the previous bilingual release.

# План реализации лендинга

## Этап 0. Подготовка и контент

**Результат:** согласованный набор данных, пригодный для production.

1. Подтвердить рабочий email-получатель формы, публичные URL Telegram и Instagram.
2. Подтвердить право на публикацию материалов LM Group и выбрать финальные медиа из `works`.
3. Подготовить EN/RU тексты для hero, LM Group, iwiqoVPN, услуг и контактов.
4. Сформировать безопасные оптимизированные версии изображений и alt-тексты.
5. Зафиксировать домен, sender email и provider-параметры для Resend/Turnstile.

## Этап 1. Каркас и данные

**Результат:** запускаемое Next.js-приложение с типами, design tokens и двуязычным контентом.

1. Создать Next.js + TypeScript проект, настроить strict mode, lint, format и test scripts.
2. Установить и настроить Tailwind, next-intl, Motion, Zod и форму.
3. Создать локальные маршруты `/en` и `/ru`, dictionaries и locale switcher.
4. Описать типы `Project`, `GalleryItem`, контактов и локализованных строк.
5. Внести контент главного кейса LM Group, карточки iwiqoVPN, услуг и соцссылок в данные.
6. Создать UI primitives: container, button, section heading, reveal, accessible dialog.

## Этап 2. Экраны и адаптивный UI

**Результат:** завершённый визуальный путь пользователя от первого экрана до контакта.

1. Header: имя/псевдоним, навигация, языковой переключатель, mobile menu.
2. Hero: крупная типографика, позиционирование, CTA и авторская композиция.
3. Featured work: полноэкранная/крупная сцена LM Group с брендовыми медиа и результатами.
4. Secondary work: сжатая карточка iwiqoVPN с подтверждением dev-стека.
5. Visual archive: редакционная сетка постеров и айдентики, lightbox и подписи.
6. Capabilities и About: три направления и точный профессиональный контекст.
7. Contact и footer: форма, четыре контактных канала, доступные статусы.
8. Проверить все композиции на 320 px, tablet и wide desktop.

## Этап 3. Логика и интеграции

**Результат:** сайт корректно локализуется, форма безопасно доставляет обращения.

1. Добавить scroll-to-section, сохранение hash при смене языка и keyboard-навигацию.
2. Добавить анимации reveal, hover и transition; создать reduced-motion альтернативу.
3. Реализовать клиентскую и серверную Zod-валидацию формы.
4. Создать `/api/contact`: honeypot, Turnstile validation, rate limiting и отправка через Resend.
5. Подключить `CONTACT_RECIPIENT_EMAIL`, доменно верифицированный sender и Vercel environment variables.
6. Добавить metadata, OG images, sitemap, robots, canonical/hreflang и JSON-LD.
7. Подключить privacy-friendly аналитику событий CTA после выбора провайдера.

## Этап 4. Тесты и качество

**Результат:** предсказуемый релиз без критических UX, accessibility и form-регрессий.

1. Unit-тесты схемы формы, локализации и форматирования сообщения.
2. Component-тесты locale switcher, формы и диалога галереи.
3. E2E: переход EN/RU, якорная навигация, открытие/закрытие lightbox, валидная и невалидная форма.
4. Axe-проверка и ручная keyboard-проверка всех интерактивных компонентов.
5. Проверить `prefers-reduced-motion`, сетевую деградацию формы и изображения на медленном соединении.
6. Запустить lint, typecheck, test, production build и Lighthouse.

## Этап 5. Публикация

**Результат:** сайт доступен пользователям и принимает реальные обращения.

1. Подключить GitHub-репозиторий к Vercel и создать preview deployment.
2. Заполнить production environment variables без коммита секретов.
3. Подключить домен, настроить Resend DNS/SPF/DKIM и протестировать доставку.
4. Проверить EN/RU metadata и OG cards на production URL.
5. Выполнить финальный smoke-тест desktop/mobile и опубликовать production deployment.

## Контрольные критерии

- LM Group — заметный первый кейс; iwiqoVPN не перетягивает на себя фокус.
- Каждый текст и интерактивное состояние существуют на RU и EN.
- Посетитель может быстро увидеть работы и связаться через форму или один из четырёх каналов.
- Сообщения реально поступают на рабочую почту, а секреты остаются только в environment variables.
- Интерфейс работает с клавиатурой, на мобильном устройстве и при reduced motion.
