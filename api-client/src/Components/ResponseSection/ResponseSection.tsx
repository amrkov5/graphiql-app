import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ResponseSection.module.css';

interface ResponseSectionProps {
  response: string | null;
  error: string | null;
  statusCode: number | null;
}

const ResponseSection: React.FC<ResponseSectionProps> = ({
  response,
  error,
  statusCode,
}) => {
  return (
    <div className={styles.responseSection}>
      {statusCode !== null && (
        <div className={styles.statusCode}>
          <strong>Status Code:</strong> {statusCode}
        </div>
      )}
      {response && (
        <div className={styles.codeBlock}>
          <SyntaxHighlighter language="json" style={dracula}>
            {response}
          </SyntaxHighlighter>
        </div>
      )}
      {error && <div className={styles.errorSection}>{error}</div>}
    </div>
  );
};

export default ResponseSection;
