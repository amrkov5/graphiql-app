import { useEffect, useState } from 'react';
import styles from './HeadersEditor.module.css';
import { useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

interface Header {
  id: number;
  key: string;
  value: string;
}

const HeadersEditor: React.FC = () => {
  const searchParams = useSearchParams();
  const params = Array.from(searchParams.entries());
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
    <div className={styles.headersContainer}>
      <div className={styles.headersControls}>
        <h3 className={styles.title}>Headers</h3>
        <button className={styles.addButton} onClick={addHeader}>
          Add New
        </button>
      </div>
      <ul className={styles.headersList}>
        {headers.map((header) => (
          <li key={header.id} className={styles.headerItem}>
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) =>
                updateHeader(header.id, e.target.value, header.value)
              }
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Value"
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
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeadersEditor;
