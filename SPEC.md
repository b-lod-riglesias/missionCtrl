# 🎛️ Mission Control — Spec

> **Estado:** 🔴 En desarrollo

---

## 📌 Objetivo

Plataforma web para gestionar y coordinar múltiples OpenClaws en la empresa Rogelio Iglesias e Hijos. Inspirada visualmente en [Jyra](https://jyra.io). Permite ver estado de cada OpenClaw, configurar triggers, recibir alertas y gestionar incidencias.

---

## 🌐 ссылка

**Repositorio:** `git@github.com:b-lod-riglesias/missionCtrl.git`

---

## 🎨 Diseño Visual (referencia Jyra)

Jyra es un dashboard oscuro con cards limpios, métricas claras y navegación lateral. El nuestro seguirá el mismo patrón:

```
┌──────────────────────────────────────────────────────────────┐
│  🎛️ Mission Control          🔍 Buscar     [Notificaciones] │
├─────────┬────────────────────────────────────────────────────┤
│         │                                                     │
│ 📊 Home │   ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ 🤖 Bots │   │ OC Incid.│ │OC Stock  │ │ OC RRHH  │           │
│ ⚡ Trig.│   │  🟢 ON   │ │  🟢 ON   │ │  🔴 OFF  │           │
│ 📈 Stats│   └──────────┘ └──────────┘ └──────────┘           │
│ ⚙️ Conf.│                                                     │
│         │   ┌────────────────────────────────────────┐       │
│         │   │  Actividad reciente                     │       │
│         │   └────────────────────────────────────────┘       │
│         │                                                     │
└─────────┴────────────────────────────────────────────────────┘
```

**Paleta de color:**
- Background: `#0f0f0f` (negro profundo)
- Cards: `#1a1a1a` (gris oscuro)
- Borde: `#2a2a2a`
- Texto principal: `#ffffff`
- Texto secundario: `#888888`
- Acento: `#6366f1` (indigo)
- Success: `#22c55e`
- Warning: `#f59e0b`
- Error: `#ef4444`

---

## 🏗️ Tech Stack

| Capa | Tecnología |
|------|-------------|
| **Framework** | Next.js 14+ (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS |
| **Estado** | Zustand |
| **HTTP Client** | Axios |
| **WebSocket** | Socket.io (para live updates) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notificaciones** | Sonner |

---

## 📦 Estructura del Proyecto

```
missionCtrl/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/           # Base UI (Button, Card, Input...)
│   │   ├── layout/       # Sidebar, Header, Layout
│   │   ├── bots/         # BotCard, BotStatus, BotList
│   │   └── triggers/     # TriggerEditor, TriggerList
│   ├── pages/            # Next.js App Router pages
│   │   ├── index.tsx     # Dashboard home
│   │   ├── bots.tsx      # Gestión de bots
│   │   ├── triggers.tsx  # Editor de triggers
│   │   └── stats.tsx     # Estadísticas
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Helpers
│   ├── types/            # TypeScript types
│   └── lib/              # API client, socket, constants
├── docs/                 # Documentación
├── public/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔑 Funcionalidades MVP

### 1. Dashboard principal
- Ver todos los OpenClaws con su estado (online/offline/busy)
- Cards con última actividad y uptime
- Actividad reciente en tiempo real

### 2. Gestión de Bots
- Lista de OpenClaws conectados
- Ver configuración de cada uno
- Encender/apagar remotamente

### 3. Editor de Triggers
- Crear triggers: "SI evento EN bot X → EJECUTAR acción EN bot Y"
- Condiciones simples (estado, tipo de mensaje, keywords)
- Listado visual de triggers activos

### 4. Estadísticas
- Peticiones por bot (últimas 24h)
- Errores y uptime
- Gráficos básicos con Recharts

### 5. Notificaciones
- Alertas cuando un bot falla
- Notificaciones en tiempo real (Socket.io)

---

## 🔌 API / Integraciones Futuras

| Servicio | Propósito |
|----------|-----------|
| **Discord** | Coordinación entre bots (via OpenClaw) |
| **OpenClaw Gateway** | API REST del gateway local |
| **WebSocket** | Live updates del estado de bots |

---

## 📋 Roadmap

```
[ ] Setup proyecto Next.js + Tailwind + TypeScript
[ ] Layout base (Sidebar + Header)
[ ] Dashboard con cards de estado
[ ] Página de Bots
[ ] Editor de Triggers
[ ] Página de Estadísticas
[ ] Integración WebSocket
[ ] Notificaciones en tiempo real
[ ] Responsive mobile
[ ] Deploy
```

---

## 👥 Responsables

| Agente | Rol |
|--------|-----|
| **Boneca** | Coordinación + Gestión del proyecto |
| **Thor** | Implementación frontend/backend |
| **Parker** | Despliegue + Infraestructura |
| **Steve** | Seguridad |
| **Clint** | Testing |

---

*Creado por: Boneca*
*Fecha: 2026-04-08*
