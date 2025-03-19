import { ReactElement, useState } from 'react';
import { useLocalStorage } from '@shared/hooks/use-local-storage.tsx';
import { Country } from '@shared/types.ts';
import { TableHead } from '@shared/ui/table/table-head.tsx';
import { TableRow } from '@shared/ui/table/table-row.tsx';

import styles from './table.module.scss';

interface Props {
  countries: Country[];
}

enum DIRECTIONS {
  'asc' = -1,
  'desc' = 1,
  '' = 0,
}

export function Table(props: Props): ReactElement {
  const [ls, setLs] = useLocalStorage('countries', '[]');
  const [countries, setCountries] = useState<Country[]>([...props.countries]);
  const regions = [
    'All',
    ...Array.from(new Set(props.countries.map((country) => country.region))),
  ];
  const [nameDirection, setNameDirection] = useState<'asc' | 'desc' | ''>('');
  const [populationDirection, setPopulationDirection] = useState<
    'asc' | 'desc' | ''
  >('');

  function sortByName() {
    if (!nameDirection) setNameDirection('asc');
    else if (nameDirection === 'asc') setNameDirection('desc');
    else setNameDirection('asc');
    setCountries([
      ...countries.sort((a, b) => {
        if (a.name.common < b.name.common)
          return -1 * DIRECTIONS[nameDirection || 'desc'];
        if (a.name.common > b.name.common)
          return 1 * DIRECTIONS[nameDirection || 'desc'];
        else return 0;
      }),
    ]);
  }

  function filterByRegion(region: string) {
    if (region === 'All') setCountries([...props.countries]);
    else
      setCountries(
        [...props.countries].filter((country) => country.region === region)
      );
  }

  function sortByPopulation() {
    setCountries([
      ...countries.sort((a, b) => {
        return (
          (a.population - b.population) *
          DIRECTIONS[populationDirection || 'desc']
        );
      }),
    ]);
    if (!populationDirection) setPopulationDirection('asc');
    else if (populationDirection === 'asc') setPopulationDirection('desc');
    else setPopulationDirection('asc');
  }

  function filterByName(name: string) {
    if (!name) setCountries(props.countries);
    setCountries([
      ...props.countries.filter((country) =>
        country.name.common.toLowerCase().includes(name.toLowerCase())
      ),
    ]);
  }

  return (
    <table className={styles.table}>
      <TableHead
        regions={regions}
        filterByRegion={filterByRegion}
        sortByName={sortByName}
        nameDirection={nameDirection}
        sortByPopulation={sortByPopulation}
        populationDirection={populationDirection}
        findByName={filterByName}
      />
      <tbody className={styles.tableBody}>
        {countries.map((country) => (
          <TableRow
            key={country.name.common}
            ls={ls}
            setLs={setLs}
            row={country}
          />
        ))}
      </tbody>
    </table>
  );
}
