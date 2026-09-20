# ARCHITECTURE — Персональное портфолио Maxim Matsulevich / iwioke

- **Статус:** целевая архитектура первого релиза
- **Дата:** 20 сентября 2026

## 1. Архитектурное решение

Сайт реализуется как **статически ориентированное приложение на Next.js + TypeScript** с серверным endpoint только для безопасной отправки формы. Это сочетает быстрый рендеринг, индексируемость, двухъязычные страницы, оптимизацию изображений и простой production-деплой.

Контент портфолио остаётся в репозитории в типизированных TS/JSON-модулях: для изменений не нужна CMS. Внешние сервисы ограничены доставкой почты и защитой формы от спама.

```text
Браузер
  ├─ статические EN/RU страницы, медиа и motion-сценарии
  ├─ локальные данные кейсов/галереи
  └─ POST /api/contact
          ├─ серверная валидация + honeypot + Turnstile
          └─ Resend API → рабочая почта Максима

Vercel
  ├─ Next.js build и CDN
  ├─ Serverless route handler контактов
  └─ production environment variables
```

## 2. Технологический стек

| Область | Решение | Обоснование |
| --- | --- | --- |
| Фреймворк | Next.js (App Router), React, TypeScript | SSG, SEO, route handlers, Image/Font optimization, строгие типы |
| Стили | Tailwind CSS + CSS custom properties | Быстрый responsive UI и управляемые design tokens |
| Анимация | Motion for React | Управляемые scroll/reveal/hover-анимации с поддержкой reduced motion |
| Локализация | next-intl | Локальные маршруты, типизированные словари EN/RU и metadata |
| Формы | React Hook Form + Zod | Удобная UX-валидация, единая схема на клиенте и сервере |
| Почта | Resend | Простой серверный API для транзакционных обращений без хранения ключей в клиенте |
| Anti-spam | Cloudflare Turnstile + honeypot | Защита без CAPTCHA-нагрузки на посетителя |
| Изображения | next/image, AVIF/WebP | Responsive sizes, ленивое чтение, оптимизированная доставка |
| Тесты | Vitest, React Testing Library, Playwright, axe-core | Проверка логики, компонентов, доступности и основных пользовательских сценариев |
| Качество | ESLint, Prettier, TypeScript strict | Единый стиль и раннее обнаружение ошибок |
| Деплой | Vercel | Нативная поддержка Next.js, CDN, preview deployments и secrets |

При инициализации используются поддерживаемые стабильные версии пакетов, закреплённые lockfile. Новая зависимость проверяется до установки и не добавляется без необходимости.

## 3. Маршрутизация

```text
/[locale]                         главная страница, locale = en | ru
/[locale]/#work                   якорь к проектам
/[locale]/#about                  якорь к блоку о специалисте
/[locale]/#contact                якорь к контактам
/api/contact                      POST: отправка обращения
/sitemap.xml                      generated sitemap
/robots.txt                       robots
```

Middleware определяет допустимую локаль и перенаправляет корень на языковую версию. Переключатель языка строит URL парной локали, сохраняя hash-якорь.

## 4. Структура проекта

```text
app/
  [locale]/
    layout.tsx                    локальный layout, шрифты, metadata
    page.tsx                      композиция лендинга
  api/contact/route.ts            защищённая отправка формы
  sitemap.ts
  robots.ts
components/
  layout/                         Header, Footer, LocaleSwitcher
  sections/                       Hero, FeaturedWork, Archive, Capabilities, About, Contact
  work/                           ProjectFeature, WorkCard, Gallery, Lightbox
  contact/                        ContactForm, ContactLinks
  ui/                             Button, SectionHeading, Reveal, Dialog
content/
  en.ts                           словарь и EN-контент
  ru.ts                           словарь и RU-контент
  projects.ts                     типизированные кейсы и links
  gallery.ts                      элементы visual archive
lib/
  i18n.ts                         локали, getMessages
  contact-schema.ts               Zod-схема формы
  contact.ts                      формирование безопасного email
  analytics.ts                    необязательные события без PII
public/
  images/
    lm-group/                     оптимизированные медиа главного кейса
    archive/                      постеры и айдентика
    iwiqovpn/                     скрины вторичного кейса
  og/
tests/
  unit/
  component/
  e2e/
```

## 5. Модель данных

Контент не привязан к компонентам: оба языка ссылаются на стабильные идентификаторы работ и ассетов.

```ts
type Locale = 'en' | 'ru'

type Project = {
  id: 'lm-group' | 'iwiqovpn'
  title: Record<Locale, string>
  role: Record<Locale, string>
  summary: Record<Locale, string>
  tags: string[]
  cover: ImageAsset
  media: ImageAsset[]
  featured: boolean
  links?: { label: Record<Locale, string>; href: string }[]
}

type GalleryItem = {
  id: string
  title: Record<Locale, string>
  category: 'identity' | 'poster' | 'editorial' | 'digital'
  image: ImageAsset
  alt: Record<Locale, string>
}
```

`lm-group` всегда имеет `featured: true` и рендерится до архива. Конфигурация контактов отделяется от контента:

```ts
type PublicContactLinks = {
  email: string
  telegram: string
  github: string
  instagram: string
}
```

Адрес получателя формы не попадает в `PublicContactLinks` и не передаётся в браузер.

## 6. Рендеринг и пользовательский интерфейс

- `page.tsx` — преимущественно Server Component; получает локализованный контент и статически генерируется.
- Интерактивными Client Components остаются: переключатель языка, navigation menu, motion-wrapper, lightbox и контактная форма.
- Каждая секция имеет собственный anchor `id`, заголовок и семантическую область.
- Motion оборачивается лёгкими компонентами и не блокирует первоначальную отрисовку текста или CTA.
- `prefers-reduced-motion: reduce` отключает parallax, transform-reveal и автодвижение, сохраняя моментальное появление контента.

## 7. Контактная форма

### Поток данных

1. Клиент валидирует `name`, `email`, `message` с помощью Zod/React Hook Form.
2. Клиент добавляет Turnstile token и невидимое поле-honeypot.
3. `POST /api/contact` повторно валидирует тело запроса, проверяет honeypot и Turnstile server-side.
4. Route handler выполняет ограничение частоты запросов по IP (на production — через серверное хранилище/провайдер, совместимый с Vercel).
5. Сервер отправляет письмо через Resend на `CONTACT_RECIPIENT_EMAIL`.
6. Клиент получает только безопасный статус: success или понятную ошибку; детали провайдера не раскрываются.

### Контракт endpoint

```ts
POST /api/contact
{
  name: string          // 2–80 символов
  email: string         // корректный email
  company?: string      // до 120 символов
  subject?: string      // до 140 символов
  message: string       // 20–3000 символов
  turnstileToken: string
  website?: string      // honeypot; должен быть пустым
}
```

- Ответ `201`: `{ ok: true }`.
- Ответ `400`: ошибки валидации.
- Ответ `403`: не пройдена anti-spam-проверка.
- Ответ `429`: лимит запросов.
- Ответ `500`: отправка не выполнена; сообщение не объявляется доставленным.

## 8. Переменные окружения

| Переменная | Доступ | Назначение |
| --- | --- | --- |
| `RESEND_API_KEY` | server-only | API-ключ доставки писем |
| `CONTACT_RECIPIENT_EMAIL` | server-only | Рабочая почта Максима — получатель формы |
| `CONTACT_FROM_EMAIL` | server-only | Верифицированный адрес отправителя |
| `TURNSTILE_SECRET_KEY` | server-only | Валидация токена Turnstile |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | Клиентский ключ Turnstile |
| `NEXT_PUBLIC_SITE_URL` | public | Канонический домен и sitemap |

В репозитории лежит только `.env.example` без значений. Реальные значения добавляются в настройках Vercel; ключи не логируются и не коммитятся.

## 9. Медиа-пайплайн

1. Отобрать опубликованные работы из `/Users/iwioke/Desktop/works`, не публикуя материалы без разрешения клиента.
2. Сохранить исходники вне репозитория; в Git добавлять только web-версии.
3. Подготовить несколько размеров для cover/галереи; использовать AVIF или WebP и осмысленные имена файлов.
4. Для каждого изображения сформулировать EN/RU alt-текст, описывающий работу, а не имя файла.
5. Видео LM Group загружать только при подтверждённой необходимости; для первого экрана использовать poster image, autoplay исключить.

## 10. SEO, доступность и производительность

### SEO

- `title`, description, Open Graph и Twitter metadata для каждой локали.
- `hreflang` EN/RU, canonical URL, `sitemap.xml`, `robots.txt`.
- JSON-LD: `Person` и при необходимости `CreativeWork` для главного кейса.

### Доступность

- Семантические landmarks, логичная последовательность заголовков и skip link.
- Полная keyboard-навигация: menu, locale switcher, lightbox, форма.
- Видимое focus-состояние, корректные label и сообщения ошибок через `aria-live`.
- Контраст не ниже WCAG 2.2 AA; media имеет полезные alt-тексты.

### Производительность

- SSG для контентных страниц и server-first рендер текста.
- Responsive `next/image`, `sizes`, lazy loading вне первого экрана.
- Локальные variable fonts с `font-display: swap`.
- Code splitting lightbox и необязательных motion-сценариев.
- Без тяжёлого canvas/WebGL, если его ценность не оправдывает влияние на mobile performance.

## 11. Стратегия тестирования

| Уровень | Проверяется | Инструмент |
| --- | --- | --- |
| Unit | Zod-схема, форматирование писем, locale helpers | Vitest |
| Component | форма, ссылки, смена языка, error/success states | React Testing Library |
| Accessibility | landmarks, labels, dialog, keyboard basics | axe-core + ручная проверка |
| E2E | EN/RU навигация, LM Group, form happy/error path, mobile menu | Playwright |
| Visual/manual | responsive-сетка, motion, media cropping, reduced motion | Browser preview и ручная проверка |

## 12. Деплой и эксплуатация

- Репозиторий подключается к Vercel; каждый pull request создаёт preview deployment.
- `main` публикует production build после прохождения lint, typecheck, unit/component и E2E smoke-тестов.
- До запуска production нужно: подтвердить домен у почтового провайдера, указать адрес получателя, проверить доставку и SPF/DKIM по инструкции Resend.
- Ошибки endpoint формы отслеживаются через структурные server-side логи без тела обращения и без API-ключей.
