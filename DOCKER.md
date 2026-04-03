# Docker

## Build

```bash
docker build -t rappelo-web .
```

## Run

```bash
docker run --rm -p 3000:3000 \
  -e API_BASE_URL=http://host.docker.internal:8000 \
  rappelo-web
```

## Docker Compose

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build -d
```

## Notes

- L'application écoute sur `0.0.0.0:3000`.
- La build utilise `output: "standalone"` pour réduire l'image runtime.
- Si ton backend n'est pas sur la machine hôte, adapte `API_BASE_URL`.
