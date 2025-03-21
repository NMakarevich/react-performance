import { ReactElement, memo, useEffect, useState } from 'react';
import { Country } from '@shared/types.ts';
import cl from 'classnames';

import styles from './table-row.module.scss';

interface Props {
  row: Country;
  ls: string;
  setLs: (ls: string) => void;
}

function TableRow({ row, ls, setLs }: Props): ReactElement {
  const [isVisited, setIsVisited] = useState(false);

  function handleClick() {
    const visitedCountries: string[] = JSON.parse(ls);
    if (isVisited) {
      setLs(
        JSON.stringify(
          visitedCountries.filter((country) => country !== row.name.common)
        )
      );
    } else {
      visitedCountries.push(row.name.common);
      setLs(JSON.stringify(visitedCountries));
    }
  }

  useEffect(() => {
    const countries = JSON.parse(ls) as string[];
    if (countries.includes(row.name.common)) {
      setIsVisited(true);
    } else setIsVisited(false);
  }, [ls, row.name.common]);

  return (
    <tr
      className={cl(styles.tableRow, isVisited ? styles.visited : '')}
      onClick={handleClick}
    >
      <td className={styles.tableCell}>{row.name.common}</td>
      <td className={styles.tableCell}>{row.population}</td>
      <td className={styles.tableCell}>{row.region}</td>
      <td className={cl(styles.tableCell, styles.flag)}>{row.flag}</td>
    </tr>
  );
}

export default memo(TableRow);
