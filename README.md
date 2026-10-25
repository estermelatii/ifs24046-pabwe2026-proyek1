# FloraGift – Front-End (ReactJS + Vite)

Aplikasi pemesanan bucket bunga custom online. Repository ini berisi **front-end**
(repo: `ifs24046-pabwe2026-proyek1`). Back-end (Express.js + SQLite) ada di repository terpisah.

## Struktur
```
src/
  features/    # cart, auth (Redux slice), home, catalog, quiz, checkout, orders, account, static
  components/  # komponen bersama (ui, Bouquet)
  helpers/     # api.js, constants.js
  hooks/       # useFetch.js
  store.js     # Redux store
public/foto/   # foto produk (<id>-1.jpg)
```

## Menjalankan di lokal
```bash
git clone https://github.com/estermelatii/ifs24046-pabwe2026-proyek1.git
cd ifs24046-pabwe2026-proyek1
npm install
cp .env.example .env      # Windows PowerShell: copy .env.example .env
npm run dev               # http://localhost:5173
```
`.env` berisi `VITE_API_URL=http://localhost:3000` (alamat back-end). Jalankan back-end lebih dulu.

## Tes dan coverage
```bash
npm test                  # vitest run
npm run test:coverage     # coverage 100% (lcov untuk SonarQube)
```
CI/CD memakai `Jenkinsfile` (install, test, Trivy, SonarQube, quality gate, package, deploy).
Alamat back-end bawaan saat build ada di `vite.config.js` (`API_BASEURL`), dapat diganti dengan `VITE_API_URL`.
