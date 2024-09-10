import { useEffect, useState } from 'react';
import styles from './HeadersEditor.module.css';
import { useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';

interface Header {
  id: number;
  key: string;
  value: string;
}

const HeadersEditor: React.FC = () => {
  const t = useTranslations('RestClient');
  const searchParams = useSearchParams();
  const params = Array.from(searchParams.entries());
  const [isShown, setIsShown] = useState<boolean>(true);
  const headersArray = params.map(([key, value], index) => ({
    id: index + 1,
    key,
    value,
  }));
  const [headers, setHeaders] = useState<Header[]>(headersArray);
  const [nextId, setNextId] = useState<number>(headersArray.length + 1);

  const addHeader = () => {
    setHeaders([...headers, { id: nextId, key: '', value: '' }]);
    setNextId(nextId + 1);
  };

  const updateHeader = (id: number, key: string, value: string) => {
    setHeaders(
      headers.map((header) =>
        header.id === id ? { ...header, key, value } : header
      )
    );
  };

  const deleteHeader = (id: number) => {
    setHeaders(headers.filter((header) => header.id !== id));
  };

  useEffect(() => {
    const updateHeaders = debounce(() => {
      const queryString = headers
        .reduce((acc, header) => {
          if (header.key && header.value) {
            acc.append(header.key, header.value);
          }
          return acc;
        }, new URLSearchParams())
        .toString();

      window.history.replaceState(null, '', '?' + queryString);
    }, 300);

    updateHeaders();

    return () => updateHeaders.cancel();
  }, [headers]);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.headersContainer}
        style={{ padding: isShown ? '20px' : '5px' }}
      >
        <button
          className={styles.showButton}
          onClick={() => setIsShown((state) => !state)}
        >
          {isShown ? '–' : '+'}
        </button>
        {isShown ? (
          <>
            <div className={styles.headersControls}>
              <h3 className={styles.title}>{t('headers')}</h3>
              <button className={styles.addButton} onClick={addHeader}>
                {t('addButton')}
              </button>
            </div>
            {headers.length > 0 && (
              <ul className={styles.headersList}>
                {headers.map((header) => (
                  <li key={header.id} className={styles.headerItem}>
                    <input
                      name="key"
                      type="text"
                      placeholder={t('keyPlaceholder')}
                      value={header.key}
                      onChange={(e) =>
                        updateHeader(header.id, e.target.value, header.value)
                      }
                      className={styles.input}
                    />
                    <input
                      name="value"
                      type="text"
                      placeholder={t('valuePlaceholder')}
                      value={header.value}
                      onChange={(e) =>
                        updateHeader(header.id, header.key, e.target.value)
                      }
                      className={styles.input}
                    />
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteHeader(header.id)}
                    >
                      {t('deleteButton')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className={styles.collapsed}>
            {t('headers')} ({headers.length})
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadersEditor;
