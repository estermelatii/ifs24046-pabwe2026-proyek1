# FloraGift – Front-End (ReactJS + Vite)

Aplikasi pemesanan bucket bunga custom online. Repository ini berisi **front-end**
(repo: `ifs24046-pabwe2026-proyek1`). Back-end (Express.js + SQLite) ada di repository terpisah.

## Struktur
```
src/
  config.js      # satu-satunya tempat membaca env (VITE_API_URL) + konstanta global
  services/      # lapisan akses API: apiClient, authService, productService, orderService
  features/      # cart, auth (Redux slice), home, catalog, quiz, checkout, orders, account, static
  components/    # komponen bersama (ui, Icon, Bouquet, QuantityStepper, ColorSwatches) + layout/ (Header, Footer, TabBar)
  helpers/       # format.js (rupiah, nama), constants.js (konstanta domain), validation.js (batas & pola input form)
  hooks/         # useFetch.js
  styles/        # CSS per modul: base, layout, components, home, catalog, orders-account (diimpor lewat index.css)
  store.js       # Redux store
public/foto/     # foto produk (<id>-1.jpg)
```

Alur data: komponen -> `services/*` -> `services/apiClient.js` -> back-end. Komponen tidak
memanggil `fetch`/`api` secara langsung.

## Menjalankan di lokal
```bash
git clone https://github.com/estermelatii/ifs24046-pabwe2026-proyek1.git
cd ifs24046-pabwe2026-proyek1
npm install
cp .env.example .env      # Windows PowerShell: copy .env.example .env
npm run dev               # http://localhost:5173
```
`.env` berisi `VITE_API_URL=http://localhost:3000` (alamat back-end). Jalankan back-end lebih dulu.

## Keamanan: token login
Token sesi disimpan di `localStorage` (`fg-token`). Konsekuensinya, token bisa dibaca skrip apa pun
yang berjalan di halaman bila terjadi XSS, berbeda dengan cookie `HttpOnly`. Mitigasi yang dipakai:

- Token adalah string acak yang disimpan di tabel `sessions` server (bukan JWT), sehingga bisa dicabut dari server.
- Tidak ada `dangerouslySetInnerHTML`/`innerHTML`; React meng-escape semua keluaran.
- Bila server membalas 401 untuk permintaan bertoken, `apiClient` mengirim event `auth:expired`
  dan `App` otomatis mengeluarkan pengguna serta menghapus token.
- Header `X-Content-Type-Options`, `X-Frame-Options`, dan `Referrer-Policy` dipasang lewat `vercel.json`.
- Halaman yang butuh login dilindungi guard rute `RequireAuth`; error render ditangkap `ErrorBoundary`; alamat yang tidak dikenal menampilkan halaman 404.
- Input form divalidasi dengan atribut HTML (`required`, `minLength`, `maxLength`, `pattern`, rentang tanggal) yang bersumber dari `helpers/validation.js`.

Pengembangan lanjutan yang disarankan: pindahkan token ke cookie `HttpOnly` + `SameSite` dari back-end,
beri masa berlaku pada sesi di server, dan tambahkan Content-Security-Policy.

## Tes dan coverage
```bash
npm test                  # vitest run
npm run test:coverage     # coverage 100% (lcov untuk SonarQube)
```
CI/CD memakai `Jenkinsfile` (install, test, Trivy, SonarQube, quality gate, package, deploy).
Alamat back-end dibaca dari `VITE_API_URL` (lihat `src/config.js`); bila kosong dipakai `http://localhost:3000`.
Di Vercel, isi `VITE_API_URL` pada Environment Variables lalu redeploy.
