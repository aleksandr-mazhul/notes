# Notes

A small notes app with React, TypeScript, TanStack Query, and a local JSON Server API. Users can register or sign in and then create, edit, hide, tag, and delete their notes.

## Run locally

Use Node.js 22.22 or later in the 22.x series, or Node.js 24 and later.

```bash
npm ci
test -f .env || cp .env.example .env
test -f db.json || cp db.example.json db.json
```

Start the API and the frontend in separate terminals:

```bash
npm run db   # http://localhost:3000
npm run dev  # http://localhost:5173
```

Open `http://localhost:5173/login`. To change the API address, set `VITE_API_URL` in your local `.env` and restart Vite. The repository includes `.env.example` and `db.example.json`. Git ignores the local `.env` and `db.json`.

## Demo data

For the full demo, sign in as `admin@mail.com` with password `admin`. This sample account has 25 notes with overlapping tags and a mix of visible and hidden notes. Try **Load more**, toggle **Show hidden**, and select several tag chips. The sample file also includes `anna@mail.com` / `anna1234` and `ivan@mail.com` / `ivan1234` for checking account switching.

The API and credentials in the sample database are intended for local development.

## How the app works

- **Authentication.** Login and registration run through `useMutation`. `AuthProvider` exposes the current user from `['auth', 'user']` and persists the user's ID and email in `localStorage` so the app can restore the session after a reload.
- **Filtering.** `NotesPage` builds an API query from the author, title search, visibility, selected tags, and sort order. JSON Server applies the filters and sorts before pagination. Selecting multiple tags matches notes that have any selected tag. The filter controls are restored from `sessionStorage` for the current account.
- **Pagination.** `NoteList` uses `useInfiniteQuery` to fetch two notes per page. **Load more** requests the next page and appends its results. The button disappears when the API returns `next: null`.
- **Tags.** A separate query collects unique tags from all notes for the current author, independently of the list filters. Tag strings and dates are converted between the API and app formats in `src/utils.ts`.
- **Optimistic updates.** Creating shows a temporary card on the form while the request runs. Editing immediately shows the updated note on its detail page. Deleting hides the card from the list. If a request fails, the temporary card disappears or the previous data is restored. Successful changes invalidate the relevant note queries so the list and tags can refresh from the API.

## Devtools and checks

In development, open the TanStack Query Devtools button in the top-left corner to inspect cached queries and mutation states.

```bash
npm run build
npm run lint
```
