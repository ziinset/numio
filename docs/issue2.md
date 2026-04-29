# Issue #2 — Dual Mode: Mode Latihan & Mode Belajar

## Ringkasan

Numio saat ini hanya memiliki satu flow quiz dengan adaptive difficulty. Issue ini memperkenalkan **dua mode** yang berbeda tujuan:

| Mode | Tujuan | Mekanisme Inti |
|------|--------|----------------|
| **Mode Latihan** | Uji kemampuan, adaptive difficulty naik/turun | Logika yang sudah ada sekarang — adaptive engine + sliding window |
| **Mode Belajar** | Hafalan & pemahaman bertahap per sub-materi | Spaced repetition — soal yang salah muncul lebih sering sampai dikuasai |

---

## Bagian 1 — Dual Mode System

### 1.1 Apa yang berubah

- Logika quiz yang **sudah ada** (`adaptive-engine.ts`, `use-quiz.ts`, flow di `/learn`) dijadikan **Mode Latihan**.
- Tambahkan **Mode Belajar** sebagai mode baru dengan mekanisme berbeda (lihat Bagian 2).
- User memilih mode **sebelum** memulai sesi, di halaman yang sama saat memilih topik (home page atau halaman pemilihan).

### 1.2 Perubahan UI flow

1. **Home Page** — Setelah user memilih topik, tampilkan pilihan mode: "Latihan" atau "Belajar".
2. Jika pilih **Latihan** → masuk ke flow quiz yang sudah ada (adaptive difficulty, tanpa perubahan).
3. Jika pilih **Belajar** → tampilkan pilihan **sub-materi** dulu (lihat Bagian 3), baru masuk ke flow belajar.

### 1.3 Routing

Tentukan sendiri pendekatan routing yang paling cocok. Bisa menggunakan route baru (misal `/learn/practice` dan `/learn/study`) atau query param — yang penting kedua mode punya state terpisah dan tidak saling mengganggu.

---

## Bagian 2 — Mode Belajar: Mekanisme Spaced Repetition

### 2.1 Konsep Inti

Mode Belajar **bukan** tentang adaptive difficulty (level naik/turun). Mode ini tentang **repetisi soal yang belum dikuasai** sampai user bisa menjawabnya dengan benar secara konsisten.

Flow per soal:
1. Tampilkan soal random dari pool sub-materi yang dipilih.
2. User menjawab.
3. **Jika benar** → beri feedback positif, lanjut ke soal berikutnya.
4. **Jika salah** → tampilkan jawaban yang benar, lanjut ke soal berikutnya. **Tandai soal ini untuk diulang lebih sering.**

### 2.2 Sistem Prioritas Soal

Implementasikan mekanisme sederhana agar soal yang dijawab salah muncul lebih sering:

- Setiap kombinasi soal unik (misal `4 × 5`) punya **weight/bobot**.
- Bobot awal = 1 (normal).
- Jika dijawab **salah** → naikkan bobot (misal ×2 atau +2). Soal dengan bobot lebih tinggi punya peluang lebih besar dipilih.
- Jika dijawab **benar** → turunkan bobot secara bertahap (tapi tidak langsung kembali ke 1, supaya tetap sering muncul beberapa kali lagi sebelum dianggap "sudah dikuasai").
- Jika bobot sudah kembali ke 1 (atau minimum) → soal dianggap sudah dikuasai.

> **Catatan:** Ini bukan full SRS seperti Anki — cukup weighted random selection sederhana. Jangan over-engineer.

### 2.3 Data yang perlu disimpan (per sub-materi)

Tambahkan struktur data baru di LocalStorage untuk menyimpan state Mode Belajar. Minimal yang perlu di-track:

- Sub-materi yang dipilih (misal: "Perkalian 4")
- Daftar soal yang sudah pernah dijawab beserta bobotnya
- Total soal dijawab, total benar, total salah
- Timestamp sesi terakhir

Simpan ini di bawah key `numio_data` yang sudah ada, tapi di property terpisah dari `topics` yang dipakai Mode Latihan.

### 2.4 Akhir sesi belajar

Mode Belajar tidak perlu "skor akhir" seperti Mode Latihan. Sebagai gantinya, tampilkan:
- Berapa soal yang sudah dikuasai vs belum dari sub-materi tersebut
- Soal mana saja yang masih sering salah
- Motivasi untuk lanjut belajar

---

## Bagian 3 — Pembagian Sub-Materi

### 3.1 Konsep

Setiap topik (Penjumlahan, Pengurangan, Perkalian, Pembagian) dipecah menjadi **sub-materi** agar user bisa belajar secara bertahap dan fokus.

### 3.2 Struktur Sub-Materi

Sub-materi dibagi berdasarkan salah satu operan. Contoh:

**Perkalian:**
- Perkalian 1 → soal: `1 × 1`, `1 × 2`, ..., `1 × 10`
- Perkalian 2 → soal: `2 × 1`, `2 × 2`, ..., `2 × 10`
- Perkalian 3 → soal: `3 × 1`, `3 × 2`, ..., `3 × 10`
- ... sampai Perkalian 10

**Penjumlahan:**
- Penjumlahan 1 → soal melibatkan angka 1 sebagai salah satu operan
- Penjumlahan 2 → soal melibatkan angka 2
- ... dan seterusnya

**Pengurangan & Pembagian:** Terapkan pola yang sama. Untuk pembagian, pastikan tetap tidak ada sisa (hasil bulat).

### 3.3 UI Pemilihan Sub-Materi

Setelah user memilih topik dan mode "Belajar", tampilkan daftar sub-materi dalam bentuk grid/list. Tandai mana yang sudah dikuasai (semua soal bobot minimum) dan mana yang belum pernah dicoba. Gunakan indikator visual sederhana (misal progress bar, ikon centang, atau warna).

### 3.4 Sub-materi hanya untuk Mode Belajar

Mode Latihan **tidak perlu** sub-materi — tetap gunakan random generation berdasarkan level seperti sekarang.

---

## Batasan & Catatan

1. **Jangan ubah logika Mode Latihan yang sudah ada** — cukup rename/restruktur agar jelas ini adalah "Mode Latihan".
2. **Tetap client-side only** — semua data spaced repetition disimpan di LocalStorage.
3. **Tetap gunakan tech stack yang sama** — Next.js App Router, TailwindCSS, shadcn/ui.
4. **Desain & UX** — sesuaikan dengan design system yang sudah ada di Numio. Pastikan mode switching terasa natural dan tidak membingungkan user.
5. **Prioritaskan fungsionalitas** — visual polish bisa dilakukan belakangan, yang penting mekanisme spaced repetition dan sub-materi berjalan dengan benar.
