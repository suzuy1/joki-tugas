# 📱 DompetCerdas AI - PWA (Progressive Web App)

Aplikasi web ini sudah diubah menjadi **Progressive Web App (PWA)** yang bisa di-install dan digunakan seperti aplikasi native!

## ✨ Fitur PWA

- ✅ **Installable** - Bisa di-install ke home screen (Android/iOS/Desktop)
- ✅ **Offline Support** - Tetap bisa diakses tanpa internet
- ✅ **Fast Loading** - Cache assets untuk loading lebih cepat
- ✅ **Native-like** - Tampilan fullscreen tanpa browser UI
- ✅ **Auto-update** - Service worker otomatis update versi baru

---

## 📲 Cara Install di HP (Android)

### Chrome/Edge:
1. Buka aplikasi di browser Chrome/Edge
2. Tunggu banner "Install DompetCerdas AI" muncul di bawah layar
3. Klik tombol **"Install"**
4. Atau klik menu (⋮) → **"Add to Home screen"**
5. Aplikasi akan muncul di home screen seperti aplikasi biasa

### Safari (iOS):
1. Buka aplikasi di Safari
2. Klik tombol **Share** (kotak dengan panah ke atas)
3. Scroll dan pilih **"Add to Home Screen"**
4. Klik **"Add"**
5. Aplikasi akan muncul di home screen

---

## 💻 Cara Install di Desktop

### Chrome/Edge (Windows/Mac/Linux):
1. Buka aplikasi di browser
2. Klik icon **install** (⊕) di address bar (kanan atas)
3. Atau klik menu (⋮) → **"Install DompetCerdas AI"**
4. Aplikasi akan terbuka di window terpisah

---

## 🚀 Cara Menjalankan (Development)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

Aplikasi akan berjalan di: **http://localhost:3000**

---

## 📦 Deploy ke Hosting (Agar Bisa Diakses dari HP)

### Opsi 1: Vercel (GRATIS & MUDAH)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Opsi 2: Netlify (GRATIS)
```bash
# Build dulu
npm run build

# Upload folder 'dist' ke Netlify.com
```

### Opsi 3: GitHub Pages (GRATIS)
1. Push project ke GitHub
2. Settings → Pages → Deploy from branch
3. Pilih branch dan folder `/dist`

**PENTING:** PWA harus diakses via **HTTPS** untuk bisa di-install!

---

## 🔧 File PWA yang Dibuat

```
public/
├── manifest.json       # Metadata aplikasi (nama, icon, warna)
├── sw.js              # Service Worker (offline cache)
├── icon-192.png       # Icon 192x192
└── icon-512.png       # Icon 512x512

components/
└── PWAPrompt.tsx      # Install banner & offline indicator

index.html             # Updated dengan PWA meta tags
index.css              # PWA-specific styles
```

---

## 🎯 Cara Menggunakan Setelah Install

1. **Buka dari home screen** - Aplikasi akan buka fullscreen
2. **Offline mode** - Data tersimpan di local storage
3. **Update otomatis** - Refresh untuk dapat versi terbaru

---

## 🐛 Troubleshooting

### Banner install tidak muncul?
- Pastikan akses via **HTTPS** (bukan HTTP)
- Clear cache browser
- Coba mode incognito

### Service worker tidak register?
- Buka DevTools → Application → Service Workers
- Cek console untuk error
- Pastikan file `sw.js` bisa diakses

### Data hilang setelah clear cache?
- Data tersimpan di **localStorage** (tidak hilang)
- Service worker cache hanya untuk assets (HTML/CSS/JS)

---

## 📝 Catatan Penting

1. **Data Privacy**: Semua data tersimpan di device (tidak ada server)
2. **Backup**: Export data secara manual jika perlu
3. **Update**: Refresh aplikasi untuk dapat fitur terbaru
4. **Browser Support**: Chrome, Edge, Safari, Firefox (modern versions)

---

## 🎨 Customization

### Ubah warna tema:
Edit `public/manifest.json`:
```json
{
  "theme_color": "#0ea5e9",
  "background_color": "#f8fafc"
}
```

### Ubah icon:
Replace `public/icon-192.png` dan `public/icon-512.png`

### Ubah nama aplikasi:
Edit `public/manifest.json`:
```json
{
  "name": "Nama Aplikasi Baru",
  "short_name": "Singkatan"
}
```

---

## 🚀 Next Steps

1. **Deploy** ke hosting (Vercel/Netlify)
2. **Share link** ke teman/keluarga
3. **Install** di semua device
4. **Enjoy** aplikasi pribadi Anda!

---

**Dibuat dengan ❤️ menggunakan React + Vite + PWA**
