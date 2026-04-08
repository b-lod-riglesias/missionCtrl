# Deploy — Mission Control

## Estado

✅ Build verificado localmente  
⏳ Vercel CLI requiere autenticación manual (paso 1)  
⏳ Deploy pendiente de validar `NEXT_PUBLIC_GATEWAY_URL`

---

## Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Repo `git@github.com:b-lod-riglesias/missionCtrl.git` accesible

---

## Paso 1 — Login en Vercel (autenticación manual)

```bash
npm install -g vercel
cd missionCtrl
vercel login
```

Vercel abrirá un flujo OAuth dispositivo. Seguir las instrucciones en pantalla (código de dispositivo).

---

## Paso 2 — Link proyecto

```bash
cd missionCtrl
vercel link
```

Seleccionar:
- Scope: cuenta personal o equipo
- Proyecto: crear nuevo o seleccionar existente
- Root directory: `.` (por defecto)

Esto crea `.vercel/project.json`.

---

## Paso 3 — Configurar variable de entorno

En el dashboard de Vercel (https://vercel.com/dashboard → proyecto → Settings → Environment Variables):

| Variable | Valor | Entornos |
|----------|-------|----------|
| `NEXT_PUBLIC_GATEWAY_URL` | `http://localhost:3001` (desarrollo) o IP del gateway real | Production, Preview, Development |

Para desarrollo local, crear `.env.local`:
```bash
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001
```

---

## Paso 4 — Deploy

### Preview (rama `main` → auto-deploy)

```bash
vercel --prod
```

O conectando el repo desde el dashboard de Vercel:
1. Importar repo desde GitHub
2. Framework: Next.js (detectado automáticamente)
3. Root Directory: `/`
4. Build Command: `npm run build` (por defecto)
5. Output Directory: `.next` (por defecto)
6. Environment Variables: añadir `NEXT_PUBLIC_GATEWAY_URL`

### Desarrollo local

```bash
vercel dev
```

---

## Arquitectura de Deploy

```
GitHub (main)
    │
    ▼
Vercel (Preview auto-deploy en cada push a main)
    │
    ▼
Vercel (Production) ← deploy manual con --prod
    │
    ▼
Users → Browser (Next.js app)
    │
    ▼
OpenClaw Gateway ← NEXT_PUBLIC_GATEWAY_URL (polling cada 30s)
```

---

## Decisiones técnicas

### Por qué Vercel
- Next.js 14 con App Router → soporte nativo
- Preview deployments automáticos por rama
- CDN global sin configuración

### Live updates: polling (no WebSocket)
- Polling cada 30s implementado (cliente → gateway)
- Socket.io + WebSocket persistente queda para post-MVP
- Razón: Vercel Functions no mantienen conexiones persistentes; polling no necesita nada especial

### Variables de entorno runtime
- `NEXT_PUBLIC_GATEWAY_URL`: accesible en cliente (necesario para polling desde el browser)
- No hay secret keys sensibles ya que no hay auth custom

---

## Troubleshooting

### Build falla en Vercel pero local funciona
```bash
# Limpiar cache y rebuild
vercel --force
```

### `.env` no cargando en production
- Ir a Settings → Environment Variables → marcar en Production

### 404 en rutas dinámicas
- Next.js 14 App Router → verificar que todas las rutas usan `app/` router, no `pages/`

---

## Links

- Vercel Dashboard: https://vercel.com/dashboard
- Repo: git@github.com:b-lod-riglesias/missionCtrl.git
- Spec: `SPEC.md`
