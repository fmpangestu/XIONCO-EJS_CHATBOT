# 🛍️ Sistem Admin Toko & AI Chatbot

Proyek ini dikembangkan sebagai bagian dari **Pre-Interview Test Web Developer**. Aplikasi ini menggabungkan sistem manajemen stok sederhana dengan asisten virtual berbasis AI.

## 📸 Screenshots

| Dashboard Admin | AI Chatbot Assistant |
|:---:|:---:|
| ![Dashboard](./public/chatbot%20closed.png) | ![Chatbot](./public/chatbot%20open.png) |
> *Demo aplikasi*

---

## ✨ Fitur Utama

1.  **Manajemen Stok & Pembelian (Admin Page)**
    * Input data pembelian barang.
    * **Otomatisasi Stok:** Stok barang di database berkurang otomatis saat pembelian terjadi.
    * **Fitur Cancel:** Stok barang otomatis kembali (refund) jika transaksi dibatalkan.
    * Tabel riwayat transaksi realtime.

2.  **AI Chatbot Assistant**
    * Terintegrasi dengan **Llama3 (via Groq AI)**.
    * Respon super cepat dan cerdas.
    * Dapat menjawab pertanyaan umum terkait toko atau bantuan teknis.

---

## 🛠️ Teknologi yang Digunakan

* **Backend:** Node.js, Express.js
* **Frontend:** EJS (Templating Engine), Tailwind CSS (CDN)
* **Database:** MySQL
* **AI Integration:** Groq API (Model: `llama-3.3-70b-versatile`)

---

## 🚀 Cara Install & Menjalankan (Localhost)

Ikuti langkah ini untuk menjalankan proyek di komputer Anda:

### 1. Clone Repository
```bash
git clone https://github.com/fmpangestu/XIONCO-EJS_CHATBOT.git
