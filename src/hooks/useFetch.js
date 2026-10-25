import { useEffect, useState } from 'react';

// Memanggil fungsi service dan mengembalikan [data, error].
// Respons yang datang setelah komponen unmount atau parameter berubah diabaikan.
export default function useFetch(fetcher, ...params) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignored = false;
    setData(null);
    setError('');
    fetcher(...params)
      .then((result) => { if (!ignored) setData(result); })
      .catch((err) => { if (!ignored) setError(err.message); });
    return () => { ignored = true; };
  }, [fetcher, ...params]);

  return [data, error];
}
