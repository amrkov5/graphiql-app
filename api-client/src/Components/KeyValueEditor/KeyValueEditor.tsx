import { Dispatch, SetStateAction, useState } from 'react';
import styles from './KeyValueEditor.module.css';
import { useTranslations } from 'next-intl';

export interface KeyValuePair {
  id: number;
  key: string;
  value: string;
}

interface KeyValueEditorProps {
  name: string;
  keyValues: KeyValuePair[];
  setKeyValues: Dispatch<SetStateAction<KeyValuePair[]>>;
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  name,
  keyValues,
  setKeyValues,
}) => {
  const t = useTranslations('RestClient');
  const [nextId, setNextId] = useState<number>(keyValues.length + 1);
  const [isShown, setIsShown] = useState<boolean>(true);
  const addPair = () => {
    setKeyValues([...keyValues, { id: nextId, key: '', value: '' }]);
    setNextId(nextId + 1);
  };

  const updatePair = (id: number, key: string, value: string) => {
    setKeyValues(
      keyValues.map((pair) => (pair.id === id ? { ...pair, key, value } : pair))
    );
  };

  const deletePair = (id: number) => {
    setKeyValues(keyValues.filter((pair) => pair.id !== id));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button
          className={styles.showButton}
          onClick={() => setIsShown((state) => !state)}
        >
          {isShown ? '–' : '+'}
        </button>
        <div className={styles.controls}>
          <h3 className={styles.title}>
            {name} ({keyValues.length})
          </h3>
          <button
            className={styles.addButton}
            onClick={() => {
              addPair();
              setIsShown(true);
            }}
          >
            {t('addButton')}
          </button>
        </div>
        {isShown && keyValues.length > 0 && (
          <ul className={styles.list}>
            {keyValues.map((pair) => (
              <li key={pair.id} className={styles.item}>
                <input
                  name="key"
                  type="text"
                  placeholder={t('keyPlaceholder')}
                  value={pair.key}
                  onChange={(e) =>
                    updatePair(pair.id, e.target.value, pair.value)
                  }
                  className={styles.input}
                />
                <input
                  name="value"
                  type="text"
                  placeholder={t('valuePlaceholder')}
                  value={pair.value}
                  onChange={(e) =>
                    updatePair(pair.id, pair.key, e.target.value)
                  }
                  className={styles.input}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() => deletePair(pair.id)}
                >
                  {t('deleteButton')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default KeyValueEditor;
