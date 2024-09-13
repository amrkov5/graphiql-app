'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getHistory } from '@/services/historyUtils';
import { useTranslations } from 'next-intl';
import styles from './HistorySection.module.css';

interface Request {
  method: string;
  fullUrl: string;
  headers: Record<string, string>;
  body: string | null;
  savedUrl: string;
}

const HistorySection: React.FC = () => {
  const router = useRouter();
  const history = getHistory();
  const t = useTranslations('History');
  const w = useTranslations('Welcome');

  const handleClick = (request: Request) => {
    router.push(request.savedUrl);
  };

  const historyEntries = Object.entries(history) as [string, Request][];

  return (
    <div className={styles.container}>
      <h1 data-testid="history-title">{t('h1')}</h1>
      {historyEntries.length === 0 ? (
        <div data-testid="empty-state">
          <p className={styles.noRequestsMsg} data-testid="no-requests-msg">
            {t('noRequests')}
          </p>
          <div className={styles.clientLinkWrapper}>
            <a
              className={styles.clientLink}
              href="/GET"
              data-testid="rest-link"
            >
              {w('rest')}
            </a>
            <a
              className={styles.clientLink}
              href="/GRAPHQL"
              data-testid="graphiql-link"
            >
              {w('graphiql')}
            </a>
          </div>
        </div>
      ) : (
        <div data-testid="history-list" className={styles.historyList}>
          <ul>
            {historyEntries.reverse().map(([key, request]) => (
              <li key={key} className={styles.request}>
                <div className={styles.method}>
                  {request.method.toLocaleUpperCase()}
                </div>
                <button
                  className={styles.url}
                  onClick={() => handleClick(request)}
                  data-testid="history-item"
                >
                  {request.fullUrl}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
