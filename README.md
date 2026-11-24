# Songwriting Studio

A local-first songwriting workspace for keeping lyrics, melodies, chords, recordings, and song ideas together.

The goal is to make it easy to move from a rough idea to a developed song without scattering the work across voice memos, notes apps, and separate documents. A song can contain movable lyric sections, chord progressions, musical details, and audio takes linked to either the whole song or an individual section.

This is also a hands-on project for refreshing and deepening React, TypeScript, CSS, application architecture, and testing skills. Development favors straightforward patterns and useful features before introducing more complex abstractions.

## Project status

**Actively developing V1.** The desktop experience comes first; mobile-friendly quick capture is part of the longer-term direction. Features and data models are still evolving.

### In place

- Song library with title search, status and tag filters, and summary counts.
- New song creation and a dedicated editor for each song.
- Editing song details, including title, tags, status, key, BPM, and tuning.
- Creating, editing, reordering, and deleting lyric sections with lyrics and chords.
- Section selection to provide context for associated recordings.
- Local persistence with Dexie and reactive reads through live queries.
- Shared UI components, including buttons, page headers, navigation, and a modal shell.
- Initial component and navigation tests.

### In progress

- Microphone recording, duration tracking, and recording previews.
- Recording cards with section labels and WaveSurfer waveform playback.
- Recording management: persistence helpers exist for creating, updating, and deleting recordings; rename and delete UI actions are still being connected.

Archive and Settings currently have placeholder pages. Capture Idea, backup/export, dedicated notes workflows, audio upload, and mobile layouts are not complete features yet.

## Product direction

These phases describe the intended progression, rather than fixed release dates or guaranteed scope. The immediate priority is a reliable everyday songwriting workflow.

### Phase 1 — A dependable local songwriting workspace

- Organize songs in a searchable, filterable library.
- Write and rearrange lyric sections and their chord progressions.
- Record, preview, rename, and delete vocal or instrumental ideas.
- Attach takes to a song or a specific section.
- Keep edits saved locally, with clear loading, saving, and failure states.
- Finish the essential keyboard and accessible interaction behavior.
- Establish useful tests around data changes and core user workflows.

### Phase 2 — Capture, organization, and portability

- Mobile-friendly layouts and a fast quick-capture flow.
- Song and section notes.
- Audio file uploads alongside microphone recordings.
- A complete archive and restore workflow.
- Backup/export and restore/import for songs and audio.
- Settings for local storage and workspace preferences.
- Better empty states and recovery when permissions or storage operations fail.

### Phase 3 — Deeper audio tools

- A smoother workflow for multiple takes and replacing recordings.
- More capable waveform navigation and playback controls.
- Explore looping, markers, and other tools that help develop musical ideas.
- Improve performance for larger libraries and longer recordings, including lightweight waveform data where useful.

### Phase 4 — Optional connected features

- Explore a backend for accounts, cross-device sync, and remote backups.
- Consider collaboration if it fits the songwriting workflow.
- Explore optional AI assistance for developing ideas.

Connected and AI features should build on a useful local experience. Their scope and implementation are intentionally undecided.

## Technology

- **React + TypeScript** for the interface and application models.
- **Vite** for development and production builds.
- **React Router in Data Mode** for navigation; database reads currently live in components through Dexie hooks.
- **Dexie + IndexedDB** for browser-local persistence.
- **Native MediaRecorder API** for microphone capture.
- **WaveSurfer.js + @wavesurfer/react** for waveform visualization and playback.
- **CSS Modules** for component styles, with global resets, tokens, and typography.
- **Lucide React and React Icons** for icons, and **React Toastify** for notifications.
- **Vitest, React Testing Library, user-event, jest-dom, and fake-indexeddb** for tests.
- **ESLint and Prettier** for code quality and formatting.
- **npm** for package management.

## Getting started

Install Node.js and npm compatible with the Vite version in `package-lock.json`, then run these commands from the project root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The current app does not require a backend or API credentials.

Microphone capture requires browser permission and a secure context: localhost works during development; deployed versions need HTTPS.

### Development commands

```sh
# Start the development server
npm run dev

# Type-check and create a production build
npm run build

# Serve the production build locally, after building
npm run preview

# Run ESLint
npm run lint

# Run all tests once
npx vitest run

# Run tests in watch mode
npx vitest

# Check formatting
npx prettier . --check
```

Tests are colocated with the code they cover. The test environment uses jsdom, and `src/test/setup.ts` initializes fake-indexeddb before database code loads.

## Project structure

```text
src/
  features/
    songs/                 # Song and lyric section persistence helpers
    recordings/            # Recording persistence helpers
  globals/
    components/            # Shared buttons, headers, navigation, and modals
    types/                 # Shared TypeScript models
  lib/
    db.ts                  # Dexie schema, tables, and initial seed data
  pages/
    library/               # Song library
    song/
      components/          # Song-specific lyrics and recording UI
    archive/               # Archive page scaffold
    settings/              # Settings page scaffold
  styles/                  # Global reset, design tokens, and base styles
  test/                    # Shared test setup
  utils/                   # Small shared utilities
  routes.tsx               # Route definitions
  App.tsx                  # Shared application layout
  main.tsx                 # React entry point and router setup
```

Import aliases such as `#features`, `#globals`, `#pages`, and `#lib` are configured in Vite and TypeScript.

## Data and component responsibilities

- Songs use string UUIDs and contain an ordered array of lyric sections. Each section has its own stable ID, so reordering or renaming it does not change its identity.
- A recording references a song through `songId` and optionally a lyric section through `sectionId`. A null section ID means the recording belongs to the whole song.
- Section titles can be derived from their IDs when displaying recordings, so renaming a section does not require copying the new title into every recording.
- One Dexie database contains songs, tags, statuses, recording metadata, and recording audio tables. Recording metadata and audio share a recording ID and are saved or deleted together in transactions.
- The separation between recording metadata and audio is still being refined; the current implementation also retains a Blob in the metadata model. Loading audio only when needed is a future improvement.
- Pages coordinate shared selection and data reads. Feature containers own their local interactions and modals. Modals handle input and recording capture; persistence helpers handle database writes.
- UI components show save failures and keep forms available for retry. Data helpers propagate errors to their callers.

## Local storage and backups

Songs and recordings are stored in **IndexedDB**, not localStorage. Data belongs to the browser profile and origin where the app is opened; it is not automatically synced to another browser or device.

Local persistence is not a backup. Clearing site data, deleting the browser profile, or browser storage eviction can remove work. Backup/export and restore are planned, but are not available yet. Avoid keeping the only copy of important songwriting material in this development version.

Database schema changes should use Dexie version upgrades and migrations when existing data needs to be preserved. Resetting a development database is only appropriate for disposable test data.
