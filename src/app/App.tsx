import { useEffect, useState } from 'react';
import { Country, Table, fetchCountries } from '@shared/index';

import './App.css';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchCountries();
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.log(error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  return (
    <>
      <h2>Countries</h2>
      <div className={'container'}>
        {loading && <div className={'loading'}>Loading...</div>}
        {countries.length > 0 && (
          <div className={'table-wrapper'}>
            <Table countries={countries} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
