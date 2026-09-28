# KineRelay Web — Motion Layer for Embodied Intelligence 🌐🦾

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black)](https://threejs.org/)
[![Backend](https://img.shields.io/badge/KineRelay_Teleop-Backend-orange)](https://github.com/Luis-Lundgren/kinerelay-teleop)
[![Website](https://img.shields.io/badge/Website-kinerelay.site-blue)](https://kinerelay.site)

**KineRelay Web** is the open-source frontend and platform hub for **KineRelay** — the motion layer for embodied intelligence. It provides **KineRelay Exchange** for on-demand robot datasets, an interactive 3D digital-twin trajectory visualizer, episode review studio, and a live WebXR robot teleoperation cockpit.

> **KineRelay** is an open-source platform for on-demand robot teleoperation and embodied-AI motion data.

---

## 🏛️ Public Architecture & System Boundaries

```text
KineRelay
├── KineRelay Web
│   Marketplace • Users • Labs • Jobs • Data
│          ↕ HTTP / WebSocket
├── KineRelay Teleop
│   Sessions • Recording • Simulation • Robot
│          ↓ adapter layer
└── TeleGrip
    WebXR • IK • Kinematics • SO-100 Control
    └── low-level teleoperation dependency
```

- **KineRelay Web** provides the user-facing platform, **KineRelay Exchange**, authentication, jobs, and dataset catalog.
- **KineRelay Teleop** manages live teleoperation sessions, robot state, recording, simulation, and hardware integration.
- **TeleGrip** provides the underlying WebXR-to-robot teleoperation engine.

---

## ✨ Features

- **KineRelay Exchange**: Search, request, and download structured robot manipulation datasets and demonstration trajectories for embodied AI.
- **3D Trajectory Viewer**: Interactive WebGL playback powered by Three.js and React Three Fiber with 6DoF end-effector trails and joint interpolation.
- **Episode Review Studio**: Filter recorded sessions, inspect success metrics, and annotate robotic episodes.
- **Live Teleoperation Cockpit**: Real-time WebSocket connection to the [`kinerelay-teleop`](https://github.com/Luis-Lundgren/kinerelay-teleop) backend for live robot monitoring and control.
- **WebXR Ready**: Direct in-browser VR support for Meta Quest and Apple Vision Pro.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Styling**: Tailwind CSS
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth & Credentials)
- **Robot Backend Integration**: WebSocket & REST to `kinerelay-teleop`

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase instance)
- A running [`kinerelay-teleop`](https://github.com/Luis-Lundgren/kinerelay-teleop) instance (optional, for live teleoperation)

### 2. Install Dependencies

```bash
git clone https://github.com/Luis-Lundgren/kinerelay-web.git
cd kinerelay-web
npm ci
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your database credentials and backend URLs:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kinerelay?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/kinerelay?schema=public"
NEXTAUTH_SECRET="generate-with-openssl-rand-hex-32"
NEXTAUTH_URL="http://localhost:3000"

# KineRelay Teleop Backend URL (preferred)
NEXT_PUBLIC_KINERELAY_TELEOP_HTTP_URL="http://localhost:8500"
NEXT_PUBLIC_KINERELAY_TELEOP_WS_URL="ws://localhost:8500/ws"

# Deprecated compatibility fallbacks (planned removal in a future release):
# NEXT_PUBLIC_EMBODEX_TELEOP_HTTP_URL="http://localhost:8500"
# NEXT_PUBLIC_EMBODEX_TELEOP_WS_URL="ws://localhost:8500/ws"
# NEXT_PUBLIC_TELEGRIP_HTTP_URL="http://localhost:8500"
# NEXT_PUBLIC_TELEGRIP_WS_URL="ws://localhost:8500"
```

### 4. Push Database Schema

```bash
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [https://kinerelay.site](https://kinerelay.site) in your browser.

---

## 🐳 Docker Deployment

Build and run with Docker:

```bash
docker build -t kinerelay-web .
docker run -p 3000:3000 --env-file .env kinerelay-web
```

---

## 🔗 Related Repositories

- **[KineRelay Teleop](https://github.com/Luis-Lundgren/kinerelay-teleop)**: Live teleoperation sessions, robot state, recording, simulation, and hardware integration.
- **[TeleGrip](https://github.com/Luis-Lundgren/telegrip)**: Core robot teleoperation engine (WebXR, kinematics, SO-100 control).

---

## 📜 License & Attribution

KineRelay Web is licensed under the [Apache License 2.0](LICENSE).
TeleGrip is maintained upstream by Emil Rofors and licensed under Apache-2.0 / MIT.
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for details on third-party libraries.
