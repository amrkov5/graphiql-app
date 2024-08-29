'use client';

import { useEffect, useState } from 'react';
import MethodSelector from '../MethodSelector/MethodSelector';
import { useSearchParams } from 'next/navigation';
import EndpointInput from '../EndpointInput/EndpointInput';
import styles from './RestClient.module.css';
import { debounce } from 'lodash';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import BodyEditor from '../BodyEditor/BodyEditor';

interface RestClientProps {
  propMethod: string;
  propUrl: string;
  propBody: string;
}

const RestClient: React.FC<RestClientProps> = ({
  propMethod,
  propUrl,
  propBody,
}) => {
  const searchParams = useSearchParams();
  const [method, setMethod] = useState(propMethod);
  const [url, setUrl] = useState(propUrl ?? '');
  const [body, setBody] = useState(propBody ?? '');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateUrl = debounce(() => {
      let newUrl = '/' + method;
      if (url) newUrl += '/' + url;
      if (body) newUrl += '/' + body;
      if (searchParams) newUrl += '?' + searchParams.toString();
      window.history.replaceState(null, '', newUrl);
    }, 300);

    updateUrl();

    return () => updateUrl.cancel();
  }, [method, url, body, searchParams]);

  const handleRequestSend = async () => {
    try {
      const decodedUrl = atob(decodeURIComponent(url));
      const parsedHeaders: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        parsedHeaders[key] = value;
      });

      const res = await fetch(decodedUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders,
        },
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        throw new Error(`Error sending request: ${res.status}`);
      }
      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(null);
      if (error instanceof Error) {
        setError('Error sending request: ' + error.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <MethodSelector method={method} setMethod={setMethod} />
        <EndpointInput url={url} setUrl={setUrl} />
        <button className={styles.send} onClick={handleRequestSend}>
          Send
        </button>
      </div>
      <HeadersEditor />
      <BodyEditor body={body} setBody={setBody} />
      <div className={styles.responseSection}>
        {response && <pre>{response}</pre>}
        {error && <div className={styles.errorSection}>{error}</div>}
      </div>
    </div>
  );
};

export default RestClient;
