import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ArrowDrop } from '@shared/ui/table/arrow-drop.tsx';
import { Arrow } from '@shared/ui/table/arrow.tsx';
import { Close } from '@shared/ui/table/close.tsx';
import { Search } from '@shared/ui/table/search.tsx';
import cl from 'classnames';

import styles from './table-head.module.scss';

interface Props {
  setNameDirection: (direction: 'asc' | 'desc' | '') => void;
  nameDirection: string;
  setPopulationDirection: (direction: 'asc' | 'desc' | '') => void;
  populationDirection: string;
  filterByRegion: (region: string) => void;
  regions: string[];
  findByName: (name: string) => void;
}

export function TableHead({
  regions,
  setPopulationDirection,
  setNameDirection,
  findByName,
  filterByRegion,
  populationDirection,
  nameDirection,
}: Props): ReactElement {
  const [showRegions, setShowRegions] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  function toggleSearch() {
    setShowSearch(!showSearch);
  }

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      findByName(event.target.value);
    },
    [findByName]
  );

  const toggleRegionSelect = useCallback(() => {
    setShowRegions(!showRegions);
  }, [showRegions]);

  const selectRegion = useCallback(
    (region: string) => {
      filterByRegion(region);
      toggleRegionSelect();
    },
    [filterByRegion, toggleRegionSelect]
  );

  const setSortNameDirection = useCallback(() => {
    setPopulationDirection('');
    if (!nameDirection) setNameDirection('asc');
    else if (nameDirection === 'asc') setNameDirection('desc');
    else setNameDirection('asc');
  }, [nameDirection, setNameDirection, setPopulationDirection]);

  const setSortPopulationDirection = useCallback(() => {
    setNameDirection('');
    if (!populationDirection) setPopulationDirection('asc');
    else if (populationDirection === 'asc') setPopulationDirection('desc');
    else setPopulationDirection('asc');
  }, [populationDirection, setNameDirection, setPopulationDirection]);

  function closeRegionSelect(event: MouseEvent) {
    const target: HTMLElement | null = event.target as HTMLElement;
    if (target && target.tagName !== 'LI' && target.tagName !== 'TH')
      setShowRegions(false);
  }

  useEffect(() => {
    if (showRegions) {
      document.addEventListener('mousedown', closeRegionSelect);
    }
    return () => {
      document.removeEventListener('mousedown', closeRegionSelect);
    };
  }, [showRegions]);

  function selectRegions() {
    return (
      <ul className={styles.regionsList}>
        {regions.map((region) => (
          <li
            className={styles.regionsListItem}
            onClick={() => selectRegion(region)}
            key={region}
          >
            {region}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <thead>
      <tr className={styles.tableRow}>
        <th className={styles.tableCell}>
          <div className={styles.sort}>
            {!showSearch ? (
              <span className={styles.name} onClick={toggleSearch}>
                Name <Search />
              </span>
            ) : (
              <div className={styles.search}>
                <input
                  type={'text'}
                  name={'name'}
                  onChange={handleChange}
                  placeholder={'Name'}
                />
                <span
                  className={styles.searchClose}
                  onClick={() => setShowSearch(false)}
                >
                  <Close />
                </span>
              </div>
            )}
            <div
              onClick={setSortNameDirection}
              className={cl(styles.direction, styles[nameDirection.toString()])}
            >
              <Arrow />
            </div>
          </div>
        </th>
        <th className={cl(styles.tableCell, styles.population)}>
          <div className={styles.sort}>
            Population{' '}
            <div
              onClick={setSortPopulationDirection}
              className={cl(
                styles.direction,
                styles[populationDirection.toString()]
              )}
            >
              <Arrow />
            </div>
          </div>
        </th>
        <th
          className={cl(
            styles.tableCell,
            styles.regions,
            showRegions ? styles.regionsOpen : null
          )}
          onClick={toggleRegionSelect}
        >
          Region <ArrowDrop />
          {showRegions ? selectRegions() : null}
        </th>
        <th className={styles.tableCell}>Flag</th>
      </tr>
    </thead>
  );
}
