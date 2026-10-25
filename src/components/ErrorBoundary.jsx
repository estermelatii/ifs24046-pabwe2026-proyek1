import { Component } from 'react';

// Menangkap error render (termasuk gagal memuat halaman lazy) agar aplikasi tidak blank.
export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Terjadi error pada tampilan:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <section className="wrap narrow">
        <h1 className="page-title">Terjadi kesalahan</h1>
        <p className="notice">Halaman ini tidak dapat ditampilkan.</p>
        <button className="btn" onClick={() => this.setState({ hasError: false })}>Coba lagi</button>
      </section>
    );
  }
}
