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

## Session cookies

Tu peux ajuster la persistance des sessions avec :

```env
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAME_SITE=lax
SESSION_COOKIE_MAX_AGE=604800
SESSION_COOKIE_DOMAIN=example.com
```

Notes :

- `SESSION_COOKIE_SECURE=true` si ton site est servi en `https`
- `SESSION_COOKIE_SECURE=false` si tu testes en `http`
- `SESSION_COOKIE_DOMAIN` est utile si tu veux partager la session entre sous-domaines

## Notes

- L'application écoute sur `0.0.0.0:3000`.
- La build utilise `output: "standalone"` pour réduire l'image runtime.
- Si ton backend n'est pas sur la machine hôte, adapte `API_BASE_URL`.
