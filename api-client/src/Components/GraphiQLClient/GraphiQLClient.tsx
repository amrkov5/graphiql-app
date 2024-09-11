'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import EndpointInput from '../EndpointInput/EndpointInput';
import { debounce } from 'lodash';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import ResponseSection from '../ResponseSection/ResponseSection';
import { useTranslations } from 'next-intl';
import styles from './GraphiQLClient.module.css';
import KeyValueEditor, { KeyValuePair } from '../KeyValueEditor/KeyValueEditor';
import GraphQLEditor from '../GraphQLEditor/GraphQLEditor';
import { safeBase64Decode } from '@/services/safeBase64Decode';
import { saveRequestToHistory } from '@/services/historyUtils';

interface GraphiQLClientProps {
  propUrl: string;
  propBody: string;
}

const GraphiQLClient: React.FC<GraphiQLClientProps> = ({
  propUrl,
  propBody,
}) => {
  const t = useTranslations('RestClient');
  const searchParams = useSearchParams();
  const [url, setUrl] = useState(propUrl ?? ''); // in base 64
  const [body, setBody] = useState(propBody ?? ''); // in base 64
  const [variables, setVariables] = useState<KeyValuePair[]>([]);

  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  useEffect(() => {
    const updateUrl = debounce(() => {
      let newUrl = '/GRAPHQL';
      if (url) newUrl += '/' + url;
      if (body) newUrl += '/' + body;
      if (searchParams) newUrl += '?' + searchParams.toString();
      window.history.replaceState(null, '', newUrl);
    }, 300);

    updateUrl();

    return () => updateUrl.cancel();
  }, [url, body, searchParams]);

  const handleRequestSend = async () => {
    try {
      const serverApiUrl = '/api/proxy';
      const decodedUrl = safeBase64Decode(url);
      const decodedBody = safeBase64Decode(body);

      if (!decodedUrl) {
        setError('URLbase64');
        setStatusCode(null);
        return;
      }

      const parsedHeaders: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        parsedHeaders[key] = value;
      });

      let updatedBody = decodedBody;
      variables.forEach(({ key, value }) => {
        const placeholder = `{{${key}}}`;
        if (updatedBody) {
          updatedBody = updatedBody.split(placeholder).join(value);
        }
      });

      const res = await fetch(serverApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullUrl: decodedUrl,
          headers: parsedHeaders,
          body: updatedBody,
        }),
      });

      setStatusCode(res.status);
      if (!res.ok) {
        throw new Error('errorSending');
      }

      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
      setError(null);

      saveRequestToHistory({
        method: 'GRAPHQL',
        fullUrl: decodedUrl,
        headers: {},
        body: decodedBody,
      });
    } catch (error) {
      setResponse(null);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('unknownError');
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.requestSection}>
        <div className={styles.inputSection}>
          <div className={styles.select}>GRAPHQL</div>
          <EndpointInput url={url} setUrl={setUrl} />
          <button className={styles.send} onClick={handleRequestSend}>
            {t('sendButton')}
          </button>
        </div>
        <div className={styles.sdl}>
          <label htmlFor="sdl" className={styles.sdlLabel}>
            SDL endpoint:
          </label>
          <input
            id="sdl"
            className={styles.input}
            placeholder="Enter SDL URL"
            type="text"
          />
          <button className={styles.getSdl}>GET</button>
        </div>
        <div className={styles.editors}>
          <KeyValueEditor
            name={t('bodyVariables')}
            keyValues={variables}
            setKeyValues={setVariables}
          />
          <HeadersEditor />
        </div>
        <GraphQLEditor body={body} setBody={setBody} />
      </div>
      <ResponseSection
        response={response}
        error={error}
        statusCode={statusCode}
      />
    </div>
  );
};

export default GraphiQLClient;
