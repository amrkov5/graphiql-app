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
import { safeBase64Decode } from '@/services/safeBase64Decode';
import { saveRequestToHistory } from '@/services/historyUtils';

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
  const [url, setUrl] = useState(propUrl ?? ''); // in base 64
  const [body, setBody] = useState(propBody ?? ''); // in base 64
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

  // sync endpoint url when updating queries
  useEffect(() => {
    const updateUrlWithQueries = debounce(() => {
      try {
        const parsedUrl = new URL(
          atob(decodeURIComponent(url)),
          window.location.origin
        );
        parsedUrl.search = '';
        queries.forEach(({ key, value }) => {
          parsedUrl.searchParams.append(key, value);
        });
        setUrl(
          btoa(parsedUrl.toString().replace(window.location.origin + '/', ''))
        );
      } catch (error) {
        console.error('Error updating URL with queries:', error);
      }
    }, 300);

    updateUrlWithQueries();

    return () => updateUrlWithQueries.cancel();
  }, [queries, url]);

  // sync queries when update endpoint url
  useEffect(() => {
    try {
      const parsedUrl = new URL(
        atob(decodeURIComponent(url)),
        window.location.origin
      );
      const newQueries: KeyValuePair[] = [];
      const urlQuries = Array.from(parsedUrl.searchParams.entries());
      urlQuries.forEach(([key, value], index) => {
        newQueries.push({ id: index, key, value });
      });
      if (parsedUrl.href.charAt(parsedUrl.href.length - 1) === '?') {
        newQueries.push({ id: urlQuries.length + 1, key: '', value: '' });
      }
      if (parsedUrl.href.charAt(parsedUrl.href.length - 1) === '&') {
        newQueries.push({ id: urlQuries.length + 2, key: '', value: '' });
      }
      setQueries(newQueries);
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  }, [url]);

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
          <MethodSelector method={method} setMethod={setMethod} />
          <EndpointInput url={url} setUrl={setUrl} />
          <button className={styles.send} onClick={handleRequestSend}>
            Send
          </button>
        </div>
        <div className={styles.editors}>
          <KeyValueEditor
            name="Query parameters:"
            keyValues={queries}
            setKeyValues={setQueries}
          />
          <HeadersEditor />
        </div>
        <BodyEditor body={body} setBody={setBody} />
        <KeyValueEditor
          name="Body variables:"
          keyValues={variables}
          setKeyValues={setVariables}
        />
      </div>
      <ResponseSection
        response={response}
        error={error}
        statusCode={statusCode}
      />
    </div>
  );
};

export default RestClient;
