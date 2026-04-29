# Numio — Adaptive Math Learning Web App

## Overview

**Numio** adalah aplikasi web pembelajaran matematika dasar yang menggunakan *adaptive learning* untuk menyesuaikan tingkat kesulitan soal secara real-time berdasarkan performa pengguna. Tidak ada autentikasi — semua data disimpan di **LocalStorage** browser.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | **Bun** |
| Framework | **Next.js** (App Router) |
| Styling | **TailwindCSS** |
| UI Components | **shadcn/ui (pakai radix ui, bukan base ui)** |
| State / Storage | **LocalStorage** (no backend) |

---

## Project Setup

### 1. Inisialisasi Project

- Buat project Next.js baru di root folder menggunakan `bunx create-next-app@latest ./` dengan opsi:
  - TypeScript: **Yes**
  - TailwindCSS: **Yes**
  - App Router: **Yes**
  - src directory: **Yes**
  - ESLint: **Yes**
- Inisialisasi shadcn/ui dengan `bunx shadcn@latest init`
- Install shadcn components yang dibutuhkan: `button`, `card`, `progress`, `dialog`, `badge`, `select`, `separator`

---

## Arsitektur Aplikasi

### Struktur Halaman (App Router)

```
src/app/
├── page.tsx              # Landing / Home — pilih topik & mulai belajar
├── learn/
│   └── page.tsx          # Halaman utama quiz / latihan soal
├── progress/
│   └── page.tsx          # Dashboard progress & statistik
├── layout.tsx            # Root layout dengan navbar
└── globals.css           # TailwindCSS global styles
```

### Struktur Utama

```
src/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── quiz/             # Komponen terkait quiz (soal, jawaban, timer)
│   ├── progress/         # Komponen statistik & chart
│   └── layout/           # Navbar, footer, sidebar
├── lib/                  # Utilities & helpers
│   ├── adaptive-engine.ts    # Logika adaptive learning
│   ├── question-generator.ts # Generator soal matematika
│   ├── storage.ts            # LocalStorage wrapper
│   └── utils.ts              # Utility umum (cn, format, dll)
├── types/                # TypeScript type definitions
│   └── index.ts
└── hooks/                # Custom React hooks
    ├── use-quiz.ts       # Hook untuk state quiz
    └── use-progress.ts   # Hook untuk akses progress data
```

---

## Fitur Utama

### 1. Home Page

- Tampilkan greeting dan penjelasan singkat aplikasi
- Pilihan **topik matematika**: Penjumlahan, Pengurangan, Perkalian, Pembagian
- Pilihan **level awal** (opsional, default: auto-detect dari history)
- Tombol "Mulai Belajar" yang mengarahkan ke halaman quiz
- Tampilkan ringkasan progress terakhir (jika ada data di LocalStorage)

### 2. Quiz / Latihan Soal (`/learn`)

- Tampilkan soal matematika satu per satu
- Input jawaban menggunakan numpad on-screen (mobile-friendly) dan keyboard
- Feedback langsung: benar (✅ animasi hijau) atau salah (❌ tunjukkan jawaban benar)
- **Timer per soal** (opsional, bisa di-toggle)
- Progress bar menunjukkan jumlah soal yang sudah dijawab dalam sesi
- Tombol "Selesai" untuk mengakhiri sesi dan lihat hasil
- **Hasil akhir sesi**: skor, akurasi, waktu rata-rata, dan rekomendasi

### 3. Adaptive Learning Engine

> Ini adalah **core** dari aplikasi.

#### Mekanisme Level

- Definisikan **5 level kesulitan** (1–5) untuk setiap topik
- Setiap level menentukan **range angka** yang digunakan dalam soal:
  - Level 1: angka 1–10
  - Level 2: angka 1–25
  - Level 3: angka 1–50
  - Level 4: angka 1–100
  - Level 5: angka 1–500 (atau multi-operasi)

#### Logika Adaptif

- Track **3–5 jawaban terakhir** sebagai sliding window
- Jika akurasi window ≥ 80% → **naikkan level**
- Jika akurasi window ≤ 40% → **turunkan level**
- Selain itu → **tetap di level saat ini**
- Pertimbangkan juga **waktu menjawab** sebagai faktor tambahan (jawaban benar tapi terlalu lama = belum mahir)

#### Data yang Di-track (per topik)

```typescript
interface TopicProgress {
  topic: "addition" | "subtraction" | "multiplication" | "division";
  currentLevel: number;           // 1-5
  totalAnswered: number;
  totalCorrect: number;
  recentAnswers: boolean[];       // sliding window (last 5)
  averageTimeMs: number;          // rata-rata waktu per soal
  bestStreak: number;             // streak jawaban benar terpanjang
  lastPlayedAt: string;           // ISO date string
}
```

### 4. Question Generator

- Generate soal secara **prosedural** berdasarkan topik dan level
- Pastikan tidak ada **pembagian dengan sisa** (untuk level dasar)
- Pastikan tidak ada **hasil negatif** untuk pengurangan (pada level rendah)
- Variasi format soal: `a + b = ?`, `a + ? = c`, `? + b = c`

### 5. Progress Dashboard (`/progress`)

- **Statistik per topik**: total soal dijawab, akurasi, level saat ini
- **Chart sederhana**: tren akurasi per sesi (gunakan CSS/SVG, tanpa library chart eksternal)
- **Badge / achievement** sederhana:
  - "Streak Master" — 10 jawaban benar berturut-turut
  - "Speed Demon" — rata-rata jawab < 3 detik
  - "Level Up!" — mencapai level 5 di suatu topik
- Tombol **reset progress** dengan konfirmasi dialog

### 6. LocalStorage Management

- Buat **wrapper module** (`lib/storage.ts`) untuk semua operasi LocalStorage
- Gunakan **satu key utama** (misal: `numio_data`) yang menyimpan semua state
- Implementasikan **versioning** sederhana pada data schema untuk migrasi ke depan
- Handle case: data corrupt, LocalStorage penuh, atau tidak tersedia

---

## Desain & UX

### Visual Style

- **Color scheme**: Warna-warna cerah dan playful tapi tidak childish — cocok untuk semua umur
- **Dark mode support**: Toggle dark/light mode, simpan preferensi di LocalStorage
- Gunakan **animasi halus** untuk transisi antar soal, feedback benar/salah, dan level up
- **Mobile-first responsive** — pastikan numpad dan soal nyaman di layar kecil
- Gunakan **emoji atau ikon** untuk membuat pengalaman lebih engaging

### Komponen UI Kunci

- **QuizCard**: Card utama yang menampilkan soal, input, dan feedback
- **NumPad**: On-screen number pad untuk input jawaban (terutama mobile)
- **ProgressRing**: Circular progress indicator untuk akurasi
- **LevelBadge**: Badge yang menunjukkan level saat ini dengan warna berbeda per level
- **TopicCard**: Card di home page untuk setiap topik matematika
- **StatsCard**: Card di progress page untuk menampilkan statistik
- **ResultDialog**: Dialog/modal yang muncul di akhir sesi quiz

---

## State Management

- Gunakan **React state** (`useState`, `useReducer`) untuk state quiz yang aktif
- Gunakan **custom hooks** untuk abstraksi logic:
  - `useQuiz()` — handle state soal saat ini, jawaban, skor, dan interaksi dengan adaptive engine
  - `useProgress()` — read/write progress dari LocalStorage
- **Tidak perlu** state management library eksternal (Zustand, Redux, dll)

---

## Catatan Implementasi

1. **Tidak ada backend / API** — semua berjalan di client-side
2. **Tidak ada autentikasi** — langsung pakai, data tersimpan di browser
3. **SEO minimal** — cukup meta tags dasar karena ini SPA-like app
4. Gunakan `"use client"` directive di komponen yang membutuhkan interaktivitas
5. Pastikan **accessibility** dasar: keyboard navigation, contrast ratio, aria labels
6. Semua teks UI dalam **Bahasa Indonesia**

---

## Urutan Pengerjaan (Milestone)

### Milestone 1 — Project Setup & Fondasi
- [ ] Init Next.js project dengan Bun
- [ ] Setup TailwindCSS & shadcn/ui
- [ ] Buat layout dasar (navbar, halaman kosong)
- [ ] Buat `lib/storage.ts` (LocalStorage wrapper)
- [ ] Definisikan types di `types/index.ts`

### Milestone 2 — Core Engine
- [ ] Implementasi `lib/question-generator.ts`
- [ ] Implementasi `lib/adaptive-engine.ts`
- [ ] Buat `hooks/use-quiz.ts`
- [ ] Buat `hooks/use-progress.ts`

### Milestone 3 — Halaman Quiz
- [ ] Buat komponen `QuizCard`, `NumPad`, feedback UI
- [ ] Implementasi halaman `/learn` dengan flow lengkap
- [ ] Integrasi adaptive engine ke quiz flow
- [ ] Tampilkan hasil akhir sesi (ResultDialog)

### Milestone 4 — Home Page & Navigation
- [ ] Buat halaman home dengan TopicCard
- [ ] Navigasi antar halaman
- [ ] Tampilkan ringkasan progress di home

### Milestone 5 — Progress Dashboard
- [ ] Buat halaman `/progress` dengan statistik per topik
- [ ] Implementasi chart/visualisasi sederhana
- [ ] Sistem badge/achievement
- [ ] Fitur reset progress

### Milestone 6 — Polish & UX
- [ ] Dark mode toggle
- [ ] Animasi dan transisi
- [ ] Responsive design fine-tuning
- [ ] Testing manual end-to-end
