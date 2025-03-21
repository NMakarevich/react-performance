import { ReactElement, memo, useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '@shared/hooks/use-local-storage.tsx';
import { Country } from '@shared/types.ts';
import { TableHead } from '@shared/ui/table/table-head.tsx';
import TableRow from '@shared/ui/table/table-row.tsx';

import styles from './table.module.scss';

interface Props {
  countries: Country[];
}

enum DIRECTIONS {
  'asc' = 1,
  'desc' = -1,
  '' = 0,
}

function Table(props: Props): ReactElement {
  const [ls, setLs] = useLocalStorage('countries', '[]');
  const regions = [
    'All',
    ...Array.from(new Set(props.countries.map((country) => country.region))),
  ];
  type regionsType = (typeof regions)[number];
  const [nameDirection, setNameDirection] =
    useState<keyof typeof DIRECTIONS>('');
  const [populationDirection, setPopulationDirection] =
    useState<keyof typeof DIRECTIONS>('');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<regionsType>(regions[0]);

  const sortByName = useCallback(
    (countryList: Country[]) => {
      if (nameDirection === '') return countryList;
      return countryList.sort((a, b) => {
        if (a.name.common < b.name.common)
          return -1 * DIRECTIONS[nameDirection || 'desc'];
        if (a.name.common > b.name.common)
          return 1 * DIRECTIONS[nameDirection || 'desc'];
        else return 0;
      });
    },
    [nameDirection]
  );

  const sortByPopulation = useCallback(
    (countryList: Country[]) => {
      if (populationDirection === '') return countryList;
      return countryList.sort(
        (a, b) =>
          (a.population - b.population) *
          DIRECTIONS[populationDirection || 'desc']
      );
    },
    [populationDirection]
  );

  const filterByRegion = useCallback(
    (countryList: Country[]) => {
      if (region === 'All') return countryList;
      else return countryList.filter((country) => country.region === region);
    },
    [region]
  );

  const filterByName = useCallback(
    (countryList: Country[]) => {
      if (!query) return countryList;
      return countryList.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
    },
    [query]
  );

  const preparedCountries = useMemo(() => {
    const filteredByName = filterByName([...props.countries]);
    const sortedByName = sortByName(filteredByName);
    const sortedByPopulation = sortByPopulation(sortedByName);
    return filterByRegion(sortedByPopulation);
  }, [
    filterByName,
    filterByRegion,
    props.countries,
    sortByName,
    sortByPopulation,
  ]);

  return (
    <table className={styles.table}>
      <TableHead
        regions={regions}
        filterByRegion={setRegion}
        setNameDirection={setNameDirection}
        nameDirection={nameDirection}
        setPopulationDirection={setPopulationDirection}
        populationDirection={populationDirection}
        findByName={setQuery}
      />
      <tbody className={styles.tableBody}>
        {preparedCountries.map((country) => (
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

export default memo(Table);
