# 🚀 Deploy ke Vercel - Cheat Sheet

## ✅ **Code Sudah Di-Push ke GitHub**
Repository: https://github.com/suzuy1/joki-tugas

---

## 📋 **Cara 1: Deploy via Website (PALING MUDAH)**

### Step 1: Login ke Vercel
1. Buka: **https://vercel.com**
2. Klik **"Sign Up"** atau **"Login"**
3. Pilih **"Continue with GitHub"**
4. Authorize Vercel untuk akses GitHub

### Step 2: Import Project
1. Klik **"Add New..."** → **"Project"**
2. Cari repository **"joki-tugas"**
3. Klik **"Import"**

### Step 3: Configure
**Project Settings:**
- Project Name: `dompetcerdas-ai` (atau terserah)
- Framework: **Vite** (auto-detect)
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`

**Environment Variables (PENTING!):**
Klik **"Environment Variables"** dan tambahkan:

```
Key: GEMINI_API_KEY
Value: AIzaSyDgTUoHZe7nOfdgxg-oSz6J83MJ8fY5pMI
```

### Step 4: Deploy
1. Klik **"Deploy"**
2. Tunggu 1-2 menit
3. Selesai! Dapat URL seperti: `https://joki-tugas.vercel.app`

---

## 🖥️ **Cara 2: Deploy via CLI**

### Install Vercel CLI (sudah dijalankan)
```bash
npm install -g vercel
```

### Login
```bash
vercel login
```
Pilih GitHub dan authorize.

### Deploy
```bash
cd c:\Users\lolih\Downloads\copy-of-dompetcerdas-ai
vercel
```

Ikuti prompt:
- Set up and deploy? **Y**
- Which scope? (pilih account Anda)
- Link to existing project? **N**
- Project name? `dompetcerdas-ai`
- In which directory? `./` (enter)
- Override settings? **N**

### Set Environment Variable
```bash
vercel env add GEMINI_API_KEY
```
Paste value: `AIzaSyDgTUoHZe7nOfdgxg-oSz6J83MJ8fY5pMI`
Pilih: **Production, Preview, Development** (semua)

### Deploy Production
```bash
vercel --prod
```

---

## 📱 **Setelah Deploy: Install di HP**

### Android (Chrome/Edge):
1. Buka URL Vercel dari HP
2. Banner "Install DompetCerdas AI" muncul
3. Klik **"Install"**
4. Aplikasi muncul di home screen ✨

### iOS (Safari):
1. Buka URL di Safari
2. Klik **Share** → **"Add to Home Screen"**
3. Klik **"Add"**

---

## 🔧 **Update Aplikasi (Setelah Edit Code)**

### Via Git Push (Auto-Deploy)
```bash
git add .
git commit -m "update: your changes"
git push
```
Vercel otomatis deploy ulang!

### Via CLI
```bash
vercel --prod
```

---

## 🎯 **Custom Domain (Opsional)**

1. Buka project di Vercel dashboard
2. Settings → Domains
3. Tambahkan domain Anda (misal: `dompetcerdas.com`)
4. Update DNS sesuai instruksi Vercel

---

## ⚠️ **Troubleshooting**

### Build Failed?
- Cek Environment Variables sudah benar
- Pastikan `npm run build` jalan di local
- Cek Vercel build logs

### PWA Tidak Bisa Di-Install?
- Pastikan akses via HTTPS (Vercel otomatis HTTPS)
- Clear cache browser
- Coba mode incognito

### Service Worker Error?
- Hard refresh (Ctrl+Shift+R)
- Unregister service worker lama di DevTools
- Deploy ulang

---

## 📊 **Vercel Dashboard**

Akses: **https://vercel.com/dashboard**

Bisa lihat:
- Deployment history
- Analytics (traffic, performance)
- Logs
- Environment variables
- Custom domains

---

## 💰 **Pricing**

**Free Tier (Hobby):**
- ✅ Unlimited deployments
- ✅ HTTPS otomatis
- ✅ 100GB bandwidth/bulan
- ✅ Serverless functions
- ✅ Cukup untuk personal project!

**Pro ($20/bulan):**
- Lebih banyak bandwidth
- Team collaboration
- Advanced analytics

---

## 🎉 **Next Steps**

1. ✅ Deploy ke Vercel
2. ✅ Test di HP
3. ✅ Install ke home screen
4. ✅ Share link ke teman/keluarga
5. ✅ Enjoy aplikasi pribadi Anda!

---

**Repository:** https://github.com/suzuy1/joki-tugas
**Vercel URL:** (akan muncul setelah deploy)
