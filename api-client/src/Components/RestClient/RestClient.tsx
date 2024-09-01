//TO CHECK FUNCTIONALITY USE

// https://httpbin.org/post

//POST

//BODY

// {
//   "name": "John Doe",
//   "age": 30
// }

//https://stapi.co/api/v1/rest/food/search

//GET

//PARAMS/HEADERS

//pageNumber
//pageSize

//
'use client';

import { useEffect, useState } from 'react';
import MethodSelector from '../MethodSelector/MethodSelector';
import { useSearchParams } from 'next/navigation';
import EndpointInput from '../EndpointInput/EndpointInput';
import styles from './RestClient.module.css';
import { debounce } from 'lodash';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import BodyEditor from '../BodyEditor/BodyEditor';
import ResponseSection from '../ResponseSection/ResponseSection';
import { safeBase64Decode } from '@/services/safeBase64Decode';

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
  const [statusCode, setStatusCode] = useState<number | null>(null);

  console.log(method, url, body, searchParams);

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
      const serverApiUrl = '/api/proxy';
      const decodedUrl = safeBase64Decode(url);
      const decodedBody = safeBase64Decode(body);

      if (!decodedUrl) {
        setError('Invalid URL: The URL must be base64 encoded.');
        setStatusCode(null);
        return;
      }

      const queryParams = new URLSearchParams(searchParams as any).toString();
      const fullUrl = queryParams ? `${decodedUrl}?${queryParams}` : decodedUrl;

      const parsedHeaders: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        parsedHeaders[key] = value;
      });

      const res = await fetch(serverApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          fullUrl,
          headers: parsedHeaders,
          body: method !== 'GET' ? JSON.parse(decodedBody || '{}') : undefined,
        }),
      });

      setStatusCode(res.status);
      if (!res.ok) {
        throw new Error(`Error sending request: ${res.status}`);
      }

      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));
      setError(null);
    } catch (error) {
      setResponse(null);
      if (error instanceof Error) {
        setError('Error sending request: ' + error.message);
      } else {
        setError('Unknown error occurred.');
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
        <HeadersEditor />
        <BodyEditor body={body} setBody={setBody} />
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
