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
import ResponseSection from '../ResponseSection/ResponseSection'; // Импортируем новый компонент

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
      const decodedUrl = safeBase64Decode(url);

      if (!decodedUrl) {
        setError('Provided URL is not a valid base64 encoded string.');
        setStatusCode(null);
        return;
      }

      const bodyFromUrl = getBodyFromUrl();
      if (method !== 'GET' && !bodyFromUrl) {
        setError('No valid body found for non-GET requests.');
        setStatusCode(null);
        return;
      }

      const queryParams = new URLSearchParams(searchParams as any).toString();
      const fullUrl = queryParams ? `${decodedUrl}?${queryParams}` : decodedUrl;

      console.log('Request URL:', fullUrl);
      console.log('Request Body:', bodyFromUrl);

      const parsedHeaders: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        parsedHeaders[key] = value;
      });

      const res = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders,
        },
        body: method !== 'GET' ? JSON.stringify(bodyFromUrl) : undefined,
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
        setError('Unknown error');
      }
    }
  };

  const safeBase64Decode = (str: string): string | null => {
    try {
      let cleanStr = str.replace(/[^A-Za-z0-9+/=]/g, '');
      const padding = cleanStr.length % 4;
      if (padding !== 0) {
        cleanStr += '='.repeat(4 - padding);
      }
      if (cleanStr.indexOf('=') !== -1) {
        cleanStr = cleanStr.split('=')[0];
      }
      console.log('Clean Base64 String:', cleanStr);
      const decoded = atob(cleanStr);
      return decodeURIComponent(escape(decoded));
    } catch (error) {
      console.error('Failed to decode base64:', error);
      return null;
    }
  };

  const getBodyFromUrl = (): string | null => {
    try {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 2) {
        const encodedBody = pathParts.slice(2).join('/');
        console.log('Encoded Body from URL:', encodedBody);
        return encodedBody;
      }
      return null;
    } catch (error) {
      console.error('Failed to get body from URL:', error);
      return null;
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
