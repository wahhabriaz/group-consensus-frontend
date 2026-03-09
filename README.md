# Consensus Frontend

A minimal, professional React frontend for the [Group Consensus API](https://github.com/wahhabriaz/group-consensus-api). Built with React, Tailwind CSS, and React Router.

## 🖥️ Pages

| Page          | Route                   | Description                                  |
| ------------- | ----------------------- | -------------------------------------------- |
| Landing       | `/`                     | Hero, features, how it works, CTA            |
| Pricing       | `/pricing`              | 3 pricing tiers with FAQ                     |
| Docs          | `/docs`                 | Full API reference with expandable endpoints |
| Register      | `/register`             | Get an API key instantly                     |
| Login         | `/login`                | Recover key by email                         |
| Dashboard     | `/dashboard`            | Overview with usage chart                    |
| Sessions      | `/dashboard/sessions`   | Look up sessions by ID                       |
| API Keys      | `/dashboard/keys`       | View, copy, revoke API key                   |
| Playground    | `/dashboard/playground` | Live test the /quick endpoint                |
| New Session   | `/session/new`          | Create a group decision session              |
| Share Session | `/session/:id/share`    | Share link + resolve consensus               |
| Join Session  | `/join/:id`             | Submit preferences as a participant          |
| Result        | `/session/:id/result`   | View full consensus result                   |

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- The [Consensus API](https://github.com/wahhabriaz/group-consensus-api) running on port 3000

### Installation

```bash
# Clone the repo
git clone https://github.com/wahhabriaz/group-consensus-frontend.git
cd consensus-frontend

# Install dependencies
npm install

# Install Tailwind CSS v3
npm install -D tailwindcss@3 autoprefixer postcss

# Copy env file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```
REACT_APP_API_URL=http://localhost:3000/v1
```

### Run Locally

```bash
# Start the backend first (in a separate terminal)
cd consensus-api && npm run dev

# Start the frontend
npm start
```

App runs at `http://localhost:3001`

## 🔄 Full Multi-Person Flow

```
1. Ali goes to /session/new
   → Creates session with topic + options
   → Gets a shareable link

2. Ali shares link with group:
   http://localhost:3001/join/SESSION_ID

3. Sara, Usman, Rehman open the link
   → Each submits their own preferences
   → No account needed to participate

4. Ali clicks "Resolve Consensus"
   → Engine runs — fair winner selected

5. Everyone views the result at:
   http://localhost:3001/session/SESSION_ID/result
   → Winner, fairness scores, conflict explanations
```

## 🎨 Tech Stack

| Tool             | Purpose                  |
| ---------------- | ------------------------ |
| React 18         | UI framework             |
| React Router v6  | Client-side routing      |
| Tailwind CSS v3  | Styling                  |
| Recharts         | Usage chart in dashboard |
| Lucide React     | Icons                    |
| DM Sans          | Body font                |
| Playfair Display | Display/heading font     |

## 📁 Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       └── DashboardLayout.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Pricing.jsx
│   ├── Docs.jsx
│   ├── Register.jsx
│   ├── Login.jsx
│   ├── NewSession.jsx
│   ├── ShareSession.jsx
│   ├── JoinSession.jsx
│   ├── SessionResult.jsx
│   └── dashboard/
│       ├── Overview.jsx
│       ├── Sessions.jsx
│       ├── ApiKeys.jsx
│       └── Playground.jsx
├── utils/
│   └── api.js
├── App.js
├── index.js
└── index.css
```

## 🔐 Auth Flow

- Register at `/register` → get `cg_live_xxx` API key
- Key stored in `localStorage`
- Dashboard routes are protected — redirect to `/login` if no key
- Recover key anytime with registered email at `/login`
- Revoke key from `/dashboard/keys`

## 🌐 Connecting to a Live API

When your backend is deployed (e.g. Railway), update `.env`:

```
REACT_APP_API_URL=https://your-api.up.railway.app/v1
```

Then rebuild:

```bash
npm run build
```

## 📦 Build for Production

```bash
npm run build
```

Output goes to `/build` folder — ready to deploy on Vercel, Netlify, or any static host.

## 🚀 Deploy on Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set env variable in Vercel dashboard:
REACT_APP_API_URL = https://your-api.up.railway.app/v1
```

## 🔗 Related

- [Consensus API](https://github.com/wahhabriaz/group-consensus-api) — Backend REST API
- [Swagger Docs](http://localhost:3000/docs) — Interactive API explorer
- [RapidAPI Listing](#) — Coming soon

## 📄 License

MIT
