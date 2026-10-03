# notes

A small notes app in React 19 and TypeScript. Write a note, tag it, hide it from the list, delete it — all against a local REST API served by json-server.

<img alt="notes: a form for a new note above a list of tagged notes" src="docs/screenshot.png" width="100%">

## Features

- Create notes with a title, content and up to five comma-separated tags
- Mark a note as hidden; every card shows whether it is visible
- Delete a note and the list refetches from the API
- Form state and validation on `react-hook-form`
- Dates travel as ISO strings and become `Date` objects at the edge (`mapNoteFromDTO` / `mapNoteToDTO` in `src/utils.ts`)

## Run it

Two processes: the API and the dev server.

```bash
npm install
npm run db    # json-server on http://localhost:3000, data in db.json
npm run dev   # Vite on http://localhost:5173
```

## Stack

React 19 · TypeScript · Vite · react-hook-form · json-server · CSS Modules · ESLint · Prettier

## Layout

```
src/
  App.tsx              fetch, create, delete
  CreateNoteForm.tsx   the form and its validation
  NoteCard.tsx         one note
  Button.tsx           shared button
  types.ts             Note and its wire format, NoteDTO
  utils.ts             DTO ↔ model mapping
```
