// Menampilkan pesan error / memuat sampai data siap, lalu merender isi.
export const Status = ({ data, error, children }) => {
  if (error) return <p className="notice">{error}. Pastikan API berjalan lalu muat ulang halaman.</p>;
  if (!data) return <p className="notice">Memuat…</p>;
  return children;
};
