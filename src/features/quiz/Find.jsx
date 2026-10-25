import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { fetchCategories, fetchRecommendations } from '../../services/productService.js';
import { ProductCard } from '../../components/ProductCard.jsx';
import { BOUQUET_STYLES } from '../../helpers/constants.js';

const BUDGET_OPTIONS = [
  { value: 150000, label: 'Maks. Rp150.000' },
  { value: 200000, label: 'Maks. Rp200.000' },
  { value: 300000, label: 'Maks. Rp300.000' },
];

export function Find() {
  const [categories] = useFetch(fetchCategories);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const questions = [
    { key: 'moment', title: 'Untuk momen apa buket ini dibeli?', options: (categories || []).map((category) => ({ value: category.id, label: category.name })) },
    { key: 'style', title: 'Gaya buket seperti apa yang kamu suka?', options: BOUQUET_STYLES.map((style) => ({ value: style, label: style })) },
    { key: 'max', title: 'Berapa budgetmu?', options: BUDGET_OPTIONS },
  ];
  const question = questions[step];
  const isLastQuestion = step === questions.length - 1;

  const goNext = async () => {
    if (!isLastQuestion) return setStep(step + 1);
    try {
      const result = await fetchRecommendations(answers);
      setRecommendations(result.items);
    } catch (err) {
      setError(err.message);
    }
  };

  const restart = () => {
    setRecommendations(null);
    setStep(0);
    setAnswers({});
  };

  if (recommendations) {
    return (
      <section className="wrap">
        <h1 className="page-title">Rekomendasi untukmu</h1><p className="muted">Buket yang paling cocok dengan jawabanmu.</p>
        <div className="grid">{recommendations.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <button className="btn ghost" onClick={restart}>Ulangi kuis</button>
      </section>
    );
  }

  return (
    <section className="wrap narrow">
      <h1 className="page-title">Find Your Bloom</h1>
      <p className="muted">Jawab beberapa pertanyaan singkat untuk mendapatkan rekomendasi buket yang paling cocok.</p>
      <div className="box quiz">
        <div className="progress"><i style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        <p className="muted small">Pertanyaan {step + 1} dari {questions.length}</p>
        <h2>{question.title}</h2>
        <div className="opts">
          {question.options.map((option) => (
            <button key={option.value} className={String(answers[question.key]) === String(option.value) ? 'on' : ''} onClick={() => setAnswers({ ...answers, [question.key]: option.value })}>{option.label}</button>
          ))}
        </div>
        {error && <p className="error">{error}</p>}
        <div className="between">
          <button className="link" disabled={!step} onClick={() => setStep(step - 1)}>Kembali</button>
          <button className="btn" disabled={answers[question.key] === undefined} onClick={goNext}>{isLastQuestion ? 'Lihat rekomendasi' : 'Selanjutnya →'}</button>
        </div>
      </div>
    </section>
  );
}
