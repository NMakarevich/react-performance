import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { ArrowDrop } from '@shared/ui/table/arrow-drop.tsx';
import { Arrow } from '@shared/ui/table/arrow.tsx';
import { Close } from '@shared/ui/table/close.tsx';
import { Search } from '@shared/ui/table/search.tsx';
import cl from 'classnames';

import styles from './table-head.module.scss';

interface Props {
  sortByName: () => void;
  sortByPopulation: () => void;
  filterByRegion: (region: string) => void;
  regions: string[];
  findByName: (name: string) => void;
  populationDirection: 'asc' | 'desc' | '';
  nameDirection: 'asc' | 'desc' | '';
}

export function TableHead({
  regions,
  sortByPopulation,
  sortByName,
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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    findByName(event.target.value);
  }

  function toggleRegionSelect() {
    setShowRegions(!showRegions);
  }

  function selectRegion(region: string) {
    filterByRegion(region);
    toggleRegionSelect();
  }

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
              onClick={sortByName}
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
              onClick={sortByPopulation}
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
