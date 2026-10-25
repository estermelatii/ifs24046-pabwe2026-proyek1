import { useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { fetchCategories, fetchProducts } from '../../services/productService.js';
import { Status } from '../../components/Status.jsx';
import { ProductCard } from '../../components/ProductCard.jsx';
import { ColorSwatches } from '../../components/ColorSwatches.jsx';
import { BOUQUET_STYLES, FLOWER_COLORS, SORT_OPTIONS } from '../../helpers/constants.js';

const PRICE_RANGES = [
  { label: 'Di bawah Rp150.000', min: 0, max: 149999 },
  { label: 'Rp150.000 – Rp200.000', min: 150000, max: 200000 },
  { label: 'Rp200.000 – Rp250.000', min: 200001, max: 250000 },
  { label: 'Di atas Rp250.000', min: 250001, max: 999999 },
];

function FilterCheckbox({ checked, onChange, children }) {
  return <label className="chk"><input type="checkbox" checked={checked} onChange={onChange} />{children}</label>;
}

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories] = useFetch(fetchCategories);
  const [catalog, error] = useFetch(fetchProducts, searchParams.toString());

  const getParam = (key) => searchParams.get(key) || '';
  const updateParams = (mutate) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const toggleFilter = (key, value) => updateParams((next) => {
    if (getParam(key) === String(value)) next.delete(key);
    else next.set(key, value);
    next.delete('page');
  });
  const togglePriceRange = ({ min, max }) => updateParams((next) => {
    next.delete('page');
    if (getParam('min') === String(min)) {
      next.delete('min');
      next.delete('max');
    } else {
      next.set('min', min);
      next.set('max', max);
    }
  });
  const changeSort = (sort) => updateParams((next) => {
    next.set('sort', sort);
    next.delete('page');
  });
  const goToPage = (page) => {
    updateParams((next) => next.set('page', page));
    window.scrollTo(0, 0);
  };

  const pageNumbers = catalog ? Array.from({ length: catalog.pages }, (_, index) => index + 1) : [];

  return (
    <section className="wrap">
      <h1 className="page-title">Shop Our Bouquets</h1>
      <p className="muted">Temukan buket mini yang sesuai dengan momenmu.{getParam('q') && ` Hasil untuk “${getParam('q')}”.`}</p>
      <div className="shop">
        <aside className="filters">
          <h4 aria-level="2">Harga</h4>
          {PRICE_RANGES.map((range) => (
            <FilterCheckbox key={range.label} checked={getParam('min') === String(range.min)} onChange={() => togglePriceRange(range)}>{range.label}</FilterCheckbox>
          ))}
          <h4 aria-level="2">Warna</h4>
          <ColorSwatches colors={FLOWER_COLORS} selectedName={getParam('color')} onSelect={(color) => toggleFilter('color', color.name)} />
          <h4 aria-level="2">Gaya</h4>
          {BOUQUET_STYLES.map((style) => (
            <FilterCheckbox key={style} checked={getParam('style') === style} onChange={() => toggleFilter('style', style)}>{style}</FilterCheckbox>
          ))}
          <h4 aria-level="2">Momen</h4>
          {categories?.map((category) => (
            <FilterCheckbox key={category.id} checked={getParam('moment') === String(category.id)} onChange={() => toggleFilter('moment', category.id)}>{category.name}</FilterCheckbox>
          ))}
          {searchParams.toString() && <button className="link" onClick={() => setSearchParams({})}>Hapus semua filter</button>}
        </aside>
        <div>
          <div className="between toolbar">
            <span className="muted">{catalog ? `${catalog.total} buket` : ''}</span>
            <label>Urutkan: <select value={getParam('sort') || 'popular'} onChange={(event) => changeSort(event.target.value)}>
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select></label>
          </div>
          <Status data={catalog} error={error}>
            {catalog?.items.length
              ? <div className="grid three">{catalog.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
              : <p className="notice">Tidak ada buket yang cocok. Coba ubah atau hapus filter.</p>}
            {catalog?.pages > 1 && (
              <div className="pager">
                {pageNumbers.map((page) => <button key={page} className={catalog.page === page ? 'on' : ''} onClick={() => goToPage(page)}>{page}</button>)}
              </div>
            )}
          </Status>
        </div>
      </div>
    </section>
  );
}
