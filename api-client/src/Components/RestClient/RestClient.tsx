'use client';

import { useEffect, useState } from 'react';
import MethodSelector from '../MethodSelector/MethodSelector';
import { useSearchParams } from 'next/navigation';
import EndpointInput from '../EndpointInput/EndpointInput';
import styles from './RestClient.module.css';
import { debounce } from 'lodash';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import BodyEditor from '../BodyEditor/BodyEditor';
import KeyValueEditor, { KeyValuePair } from '../KeyValueEditor/KeyValueEditor';
import ResponseSection from '../ResponseSection/ResponseSection';
import { fromBase64, toBase64 } from '@/services/safeBase64';
import { saveRequestToHistory } from '@/services/historyUtils';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('RestClient');
  const searchParams = useSearchParams();
  const [method, setMethod] = useState(propMethod);
  const [url, setUrl] = useState(propUrl ?? '');
  const [body, setBody] = useState(propBody ?? '');
  const [queries, setQueries] = useState<KeyValuePair[]>([]);
  const [variables, setVariables] = useState<KeyValuePair[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

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

  useEffect(() => {
    const updateUrlWithQueries = debounce(() => {
      let baseDecodedUrl = fromBase64(url);

      const urlWithoutQuery = baseDecodedUrl.split('?')[0];

      const queryString = queries
        .map(
          ({ key, value }) =>
            `${encodeURIComponent(key || '')}=${encodeURIComponent(value || '')}`
        )
        .join('&');

      const finalUrl = queryString
        ? `${urlWithoutQuery}?${queryString}`
        : urlWithoutQuery;

      setUrl(toBase64(finalUrl));
    }, 300);

    updateUrlWithQueries();

    return () => updateUrlWithQueries.cancel();
  }, [queries, url]);

  useEffect(() => {
    const baseDecodedUrl = fromBase64(url);

    const queryParamsString = baseDecodedUrl.split('?')[1] || '';
    const queryParams = queryParamsString.split('&').filter(Boolean);

    const newQueries: KeyValuePair[] = queryParams.map((param, index) => {
      const [key, value] = param.split('=');
      return {
        id: index,
        key: decodeURIComponent(key || ''),
        value: decodeURIComponent(value || ''),
      };
    });

    if (baseDecodedUrl.endsWith('?') || baseDecodedUrl.endsWith('&')) {
      newQueries.push({ id: newQueries.length, key: '', value: '' });
    }

    setQueries(newQueries);
  }, [url]);

  const handleRequestSend = async () => {
    try {
      const serverApiUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api/proxy'
          : 'https://ai-team-api-app.vercel.app/api/proxy';
      const decodedUrl = fromBase64(url);
      const decodedBody = fromBase64(body);

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
          method,
          fullUrl: decodedUrl,
          headers: parsedHeaders,
          body: method !== 'GET' ? JSON.parse(updatedBody || '{}') : undefined,
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
        method,
        fullUrl: decodedUrl,
        headers: searchParams.toString(),
        body: updatedBody,
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
          <MethodSelector method={method} setMethod={setMethod} />
          <EndpointInput url={url} setUrl={setUrl} />
          <button
            className={styles.send}
            onClick={handleRequestSend}
            data-testid="send-button"
          >
            {t('sendButton')}
          </button>
        </div>
        <div className={styles.editors}>
          <KeyValueEditor
            name={t('query')}
            keyValues={queries}
            setKeyValues={setQueries}
          />
          <HeadersEditor />
        </div>
        <KeyValueEditor
          name={t('bodyVariables')}
          keyValues={variables}
          setKeyValues={setVariables}
        />
        <BodyEditor body={body} setBody={setBody} />
      </div>
      <div className={styles.response}>
        <ResponseSection
          response={response}
          error={error}
          statusCode={statusCode}
          language="json"
        />
      </div>
    </div>
  );
};

export default RestClient;
