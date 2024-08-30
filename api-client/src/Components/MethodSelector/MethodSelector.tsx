'use client';

import { METHODS } from '../../constants';
import { Dispatch, SetStateAction } from 'react';
import styles from './MethodSelector.module.css';

interface MethodSelectorProps {
  method: string;
  setMethod: Dispatch<SetStateAction<string>>;
}

const MethodSelector: React.FC<MethodSelectorProps> = ({
  method,
  setMethod,
}) => {
  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(event.target.value);
  };

  return (
    <select
      value={method}
      onChange={handleMethodChange}
      className={styles.select}
      name="method"
    >
      {METHODS.map((method) => (
        <option key={method} value={method}>
          {method}
        </option>
      ))}
    </select>
  );
};

export default MethodSelector;
