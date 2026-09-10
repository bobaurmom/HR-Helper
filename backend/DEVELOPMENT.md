# Development Workflow

## Schema changes (add/remove/modify fields)

1. Create a migration:
   ```bash
   docker compose exec backend npx prisma migrate dev --name your_migration_name
   ```
2. Rebuild the container:
   ```bash
   docker compose up --build
   ```

## Dependency changes (add/remove packages in package.json)

Rebuild the container:
```bash
docker compose up --build
```

## Code-only changes (no schema or dependency changes)

Hot-reload handles it automatically. Just run:
```bash
docker compose up
```

## Note

You cannot run `npx prisma` from Windows PowerShell.
The `node_modules` were installed from WSL, so the binaries
are Linux executables. All Prisma commands must go through Docker.
