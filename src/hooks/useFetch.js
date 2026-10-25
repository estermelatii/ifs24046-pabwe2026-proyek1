import { useEffect, useState } from 'react';
import { api } from '../helpers/api.js';

export default function useFetch(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { setData(null); setError(''); api(path).then(setData).catch((e) => setError(e.message)); }, [path]);
  return [data, error];
}
