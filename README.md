# Habit Tracker — Step 1: Stack Bootstrap

Five containers wired together through Nginx:

```
Browser  →  Nginx (:80)  →  ┬─ React/Vite (:5173, /)
                            └─ Express   (:4000, /api)
                                          ├─ Postgres (:5432)
                                          └─ Redis    (:6379)
```

## Prerequisites
- Docker Desktop or Docker Engine + Compose plugin

## Run

```bash
cp .env.example .env        # (already included; edit if you want)
docker compose up --build
```

First boot pulls images and installs npm deps — give it 2–3 minutes.

Then open: **http://localhost**

You should see:
- "Hello from the backend 👋"
- Green dots next to Postgres and Redis
- A visit counter that increments each time you hit Refresh (proves Redis is being written to)

## Useful commands

```bash
docker compose ps                    # see what's running
docker compose logs -f backend       # tail backend logs
docker compose logs -f frontend      # tail frontend logs
docker compose logs -f nginx         # tail nginx logs
docker compose restart backend       # restart one service
docker compose down                  # stop everything
docker compose down -v               # stop + wipe data volumes (Postgres/Redis data)
```

## Hot reload

- Edit any file in `frontend/src/` → browser updates instantly (Vite HMR)
- Edit any file in `backend/src/` → backend restarts automatically (nodemon)

## What's working

- ✅ Nginx reverse-proxies `/api/*` to Express and everything else to Vite
- ✅ Vite HMR websocket goes through Nginx
- ✅ Express connects to Postgres pool
- ✅ Express connects to Redis (and writes a real key on each /api/health call)
- ✅ Service dependencies wait on healthchecks before starting backend

## Next step

Add real auth, migrations, and the habits table.

## Project layout

```
habit-tracker/
├── docker-compose.yml
├── .env / .env.example
├── nginx/
│   └── conf.d/default.conf
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── app.js
│       └── config/
│           ├── db.js
│           └── redis.js
└── frontend/
    ├── Dockerfile.dev
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        └── App.jsx
```
