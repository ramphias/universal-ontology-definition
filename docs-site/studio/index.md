# Ontology Studio

A production-ready **Next.js web application** for visually browsing, searching, editing, and governing the Universal Ontology Definition across all four layers.

> **Live demo**: [ontologystudio.netlify.app](https://ontologystudio.netlify.app) · **Source**: [`studio/`](https://github.com/ramphias/universal-ontology-definition/tree/main/studio)

## Features

- **Multi-layer visual editors** — Interactive ReactFlow node graphs for each layer:
    - L0 Platform (`L0Workspace`) — browse OWL/RDF, JSON-LD, GraphQL, SQL DDL bindings.
    - L1 Core (`L1FlowEditor`) — explore the 24 universal classes and 13 relations.
    - L2 Extensions (`L2FlowWorkspace`) — visualize each industry extension.
    - L3 Enterprise (`L3FlowWorkspace`) — work with private enterprise overlays.
- **Live GitHub sync** — Reads ontology JSON directly from the repository via the GitHub API in real time; no separate database to keep in sync.
- **Edit workflow with admin review** — Editors propose metadata changes through the in-app forms; pending edits queue up in the admin review panel where an Admin can approve/reject and commit back to GitHub via PR.
- **Role-based access control** — GitHub OAuth with three roles:
    | Role | Capabilities |
    |:---|:---|
    | **Admin** | Full read/write, manages users and roles, approves pending edits |
    | **Editor** | Can submit metadata edits; changes go through admin review |
    | **Viewer** | Read-only access to all layers |
- **Public read-only access** — Anonymous visitors can browse the entire ontology without logging in. Authentication is required only for editing and admin actions.
- **Search panel** — Full-text search across class IDs, labels (EN/ZH), and definitions, scoped to the current layer.
- **Code export** — One-click export of the current view as JSON / OWL / GraphQL / SQL via the Code Export Modal.

## Architecture

| Concern | Implementation |
|:---|:---|
| Framework | Next.js (App Router) |
| Auth | NextAuth + GitHub OAuth provider |
| Permission storage | Netlify Blobs (`ontology-permissions` store) |
| Pending edits storage | Netlify Blobs |
| Ontology data source | GitHub Contents API — reads JSON files directly from this repository |
| Commit flow | Octokit creates a branch, commits the edited JSON, and opens a PR |
| Hosting | Netlify (auto-detects `studio/netlify.toml`; `@netlify/plugin-nextjs` handles SSR) |

Permission data (user roles, pending edits) lives in Netlify Blobs — there is no external database.

## Local Development

```bash
cd studio
npm install
```

Create `studio/.env.local`:

```env
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=universal-ontology-definition
GITHUB_ID=your_oauth_app_client_id
GITHUB_SECRET=your_oauth_app_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-secret-string
SUPER_ADMIN=your-github-username
```

Then start the dev server:

```bash
npm run dev
```

> `GITHUB_ID` / `GITHUB_SECRET` come from a [GitHub OAuth App](https://github.com/settings/developers). Set the callback URL to `http://localhost:3000/api/auth/callback/github`.
>
> The `SUPER_ADMIN` env var grants the named GitHub username permanent admin role even when Netlify Blobs is unavailable (useful for first-time bootstrap and local dev).

## Deploy to Netlify

1. Create a new site on [Netlify](https://app.netlify.com/) linked to your GitHub fork.
2. Build settings (auto-detected from `studio/netlify.toml`):
    - Base directory: `studio`
    - Build command: `npm run build`
    - Publish directory: `studio/.next`
3. Add the same environment variables as above in Netlify's site settings, but set `NEXTAUTH_URL` to your deployed URL (e.g. `https://your-site.netlify.app`).
4. Deploy. The `@netlify/plugin-nextjs` plugin handles SSR and serverless functions automatically.

## Pages

| Route | Purpose |
|:---|:---|
| `/` | Landing dashboard — layer cards, recent activity, role-aware actions |
| `/layer/[id]` | Visual editor for a specific layer (L0/L1/L2/L3) |
| `/admin` | Admin panel — user management, role assignment |
| `/admin/review` | Pending edit review queue (badge in sidebar shows count) |
| `/api/auth/*` | NextAuth endpoints |
