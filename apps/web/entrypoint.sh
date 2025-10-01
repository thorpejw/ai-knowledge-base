#!/usr/bin/env sh
set -e

# Wait for Postgres (optional, if healthcheck already gates startup you can skip)
/bin/sh -c 'echo "Waiting for Postgres..."'
# You can add a tiny loop here if needed.

echo "Prisma generate…"
pnpm --filter web exec prisma generate

echo "Prisma migrate deploy…"
pnpm --filter web exec prisma migrate deploy

echo "Prisma seed…"
# Make seeds idempotent; this may run on every container start
pnpm --filter web exec prisma db seed || echo "Seed step returned non-zero (possibly already seeded). Continuing…"

echo "Start Next.js"
exec pnpm --filter web start
