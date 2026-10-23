# План: занятие 5–6 — авторизация и роутинг (Context, React Router, Tailwind)

Ветка: `feat/lesson-05-06-router-context-tailwind`
Срок сдачи: 24 окт., 08:15

## Задание — сделано

- [x] Страница регистрации — `/register`
- [x] Страница создания заметки — `/notes/new`
- [x] Страница редактирования — `/notes/:id/edit`
- [x] Страница просмотра с переносами строк — `/notes/:id`
- [x] Только свои заметки — список, теги, просмотр и редактирование;
      проверено на двух пользователях
- [x] Стили на Tailwind

Также сделано по ходу: общая форма `NoteForm`, логин через `_where` (пароли
из цифр), переименования `Layout.tsx` / `NotesPage.tsx`.

## Сдача

- [ ] Закоммитить регистрацию и исправление логина
- [ ] Открыть PR из этой ветки в `main` (старый PR #10 закрылся при
      переименовании ветки)

## Разобрать (объяснения)

- [ ] **Разделение `AuthProvider` и `useAuthContext`.** Что было в одном файле,
      что куда переехало (`hooks/useAuthContext.tsx` → контекст и хук,
      `components/AuthProvider.tsx` → компонент), почему ESLint требовал
      разделить (Fast Refresh в Vite) и как файлы теперь импортируют друг
      друга.
- [ ] **Предупреждение IDE «Duplicate code fragments»** в `NoteViewPage` и
      `EditNotePage` — откуда оно и как его убирает свой хук `useOwnNote`
      (см. «Заметки» ниже).

## Доработки

Каждый пункт — небольшая правка без новых зависимостей. Отсортированы по
пользе: сверху то, что пользователь заметит сразу.

### Регистрация (`RegisterPage.tsx`, `handleRegister`)

- [ ] `.trim()` для email перед `findUserByEmail` и `createUser`: иначе
      `" a@b.c"` и `"a@b.c"` — разные пользователи.
- [ ] `.catch` в конце цепочки: сейчас ошибка сервера (и внутреннего
      `createUser`) уходит в консоль как «Uncaught (in promise)». Внутренний
      `createUser(...)` нужно вернуть (`return`), чтобы его ошибку поймал
      общий `.catch`.

### Логин (`LoginPage.tsx`)

- [ ] **Сообщение «Неверный email или пароль».** Сейчас при неверных данных
      сервер отвечает `200` и `[]`, `if (user)` не проходит, и ничего не
      происходит. Показать ошибку через `setError('root', …)` или свой
      `useState`. Ошибку сети в `.catch` тоже показать.
- [ ] `.trim()` для email, как в регистрации.
- [ ] `'http://localhost:3000'` заменить на `API_URL` из `utils.ts`.

### Не пускать на вход, если уже вошёл

- [ ] На `/login` и `/register` при наличии `user` сразу
      `<Navigate to="/notes" replace />`. Выйти и войти в другой аккаунт —
      только через Logout.
- [ ] `replace` во всех редиректах, чтобы «Назад» не возвращал на страницу,
      которая тут же перекидывает обратно:
      - `Layout`: `<Navigate to="/login" replace />`
      - после логина и регистрации: `navigate('/notes', { replace: true })`
- [ ] Выход: при `setUser(null)` делать `localStorage.removeItem('user')`,
      а не записывать строку `"null"`.

### Заметки

- [ ] **Двойной клик по «Add Note» / «Save» создаёт две заметки** (или шлёт
      два PATCH): кнопка не блокируется, пока идёт запрос. Решение: вернуть
      Promise из `handleCreate`/`handleSave` и из `handleFormSubmit` в
      `NoteForm`, тогда RHF сам выставит `formState.isSubmitting`, и кнопку
      можно делать `disabled={!isValid || isSubmitting}`.
- [ ] Подтверждение удаления: `if (!confirm('Delete this note?')) return` в
      `handleDelete` (`NotesPage`). Сейчас заметка удаляется сразу.
- [ ] В списке показывать начало текста, а не весь: `line-clamp-3` на тело
      в `NoteCard`. Полный текст теперь есть на странице просмотра.
- [ ] Длинный заголовок без пробелов вылезает из карточки: добавить
      `wrap-anywhere` на `h2` в `NoteCard` (на странице просмотра уже есть).
- [ ] Загрузку заметки и проверку владельца из `NoteViewPage` и
      `EditNotePage` (одинаковые `useEffect` + `Status`) вынести в свой хук
      `useOwnNote(id)` → `{ note, status }`.

### Маршруты

- [ ] Неизвестный адрес (`/abc`) показывает служебную страницу React Router
      «Unexpected Application Error! 404». Добавить маршрут `path: '*'` со
      страницей «Страница не найдена» и ссылкой на `/notes`.
- [ ] Главная `/` — сейчас заглушка «home page». Заменить на
      `<Navigate to="/notes" replace />`: вошедший попадёт к заметкам,
      невошедшего Layout сам отправит на логин.

### Проект

- [ ] **`npm run lint` падает** на `react-refresh/only-export-components` в
      `useAuthContext.tsx`: в одном файле компонент `AuthProvider` и хук.
      Разнести: `AuthContext` + `useAuthContext` в `hooks/useAuthContext.ts`,
      `AuthProvider` в `components/AuthProvider.tsx`.
- [ ] README устарел: в нём CSS Modules и нет страниц логина, регистрации,
      просмотра и редактирования. Обновить разделы Features, Stack, Layout.
- [ ] `db.json` одновременно в `.gitignore` и в репозитории, поэтому каждое
      действие в приложении делает дерево «грязным». Вариант: хранить в git
      `db.example.json`, а `db.json` создавать копией и не коммитить.
- [ ] Не хранить пароль в localStorage: json-server возвращает пользователя
      вместе с `password`. Отрезать перед сохранением:
      `const { password, ...safeUser } = user` (поле `password` в типе `User`
      тогда сделать необязательным или завести отдельный тип).
