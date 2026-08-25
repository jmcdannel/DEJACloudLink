> [!IMPORTANT]
> **This project has moved.** Active development of DEJA.js and the Track & Trestle model
> railroad platform now happens in private repositories under
> [**Track and Trestle Technology, LLC**](https://github.com/trackandtrestle).
> This repository stays public as a historical snapshot and is no longer maintained.
>
> **Current product, docs, and downloads → [dejajs.com](https://dejajs.com)**

# ☁️ DEJA Cloud Link

**Vue 3 layout management console for DCC-EX model railroads.**

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

Where DEJA Throttle *drives* trains, Cloud Link *configures the railroad*. It is the
administrative half of the DEJA.js platform: the place where a layout's hardware,
roster, and automation are defined once and then consumed by every throttle on the network.

## ✨ What it does

- 🚂 **Locomotive roster** — addresses, names, function mappings, and artwork
- 🎛️ **Turnouts & accessories** — servo, relay, and DCC accessory definitions
- 💡 **Effects** — lighting, sound, and signal actions bound to layout events
- 🛤️ **Routes** — multi-turnout paths thrown as a single command
- 🔌 **Device & port registry** — which command station and IO boards belong to which layout
- 👥 **Multi-layout accounts** with Firebase Auth, so one operator can manage several railroads

## ⚙️ Tech stack

| Layer | Technologies |
|-------|-------------|
| **UI** | Vue 3, Vuetify 3, Tailwind CSS, Flowbite |
| **Data** | Firebase (Firestore + RTDB) via VueFire |
| **Build** | Vite, TypeScript, vue-tsc |
| **Extras** | `@vueuse/core`, `@vueuse/sound`, Day.js |

## 🧑‍💻 Local development

```bash
pnpm install
pnpm dev      # Vite dev server
pnpm build    # type-check + production build
```

> Requires a Firebase project. Configuration lives in `.env` — see the
> [current docs](https://dejajs.com/docs) for the supported setup.

## 🧭 Where this fits

This repo is one step in a long-running line of model railroad control software:

| Era | Project | What changed |
|-----|---------|--------------|
| 2020 | [`train-control`](https://github.com/jmcdannel/train-control) | First React throttle, JMRI + Arduino over HTTP |
| 2021 | [`dctc`](https://github.com/jmcdannel/dctc) | Standalone Arduino DC controller (no computer required) |
| 2022–23 | [`layout-conductor-*`](https://github.com/jmcdannel?tab=repositories&q=layout-conductor) | Split into app + API; Python, Node, and Deno backends explored |
| 2024 | [`Track-and-Trestle-Technology-Suite`](https://github.com/jmcdannel/Track-and-Trestle-Technology-Suite) | MQTT-based monorepo: dispatcher, throttle, dashboard, action API |
| 2024–25 | [`DEJA.js`](https://github.com/jmcdannel/DEJA.js) | TypeScript/Turborepo rewrite, Firebase realtime backbone |
| 2025– | **[dejajs.com](https://dejajs.com)** (private) | Commercial cloud platform for DCC-EX |

---

<sub>Built by [Josh McDannel](https://github.com/jmcdannel) · [dejajs.com](https://dejajs.com) · [LinkedIn](https://www.linkedin.com/in/jmcdannel)</sub>
