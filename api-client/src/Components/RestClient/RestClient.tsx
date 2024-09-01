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

  // sync app url
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
  }, [queries]);

  // sync queries when update endpoint url
  useEffect(() => {
    try {
      const parsedUrl = new URL(
        atob(decodeURIComponent(url)),
        window.location.origin
      );
      const newQueries: KeyValuePair[] = [];
      if (parsedUrl.href.charAt(parsedUrl.href.length - 1) === '?') {
        newQueries.push({ id: 1000, key: '', value: '' });
      }
      Array.from(parsedUrl.searchParams.entries()).forEach(
        ([key, value], index) => {
          newQueries.push({ id: index, key, value });
        }
      );
      setQueries(newQueries);
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  }, [url]);

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <MethodSelector method={method} setMethod={setMethod} />
        <EndpointInput url={url} setUrl={setUrl} />
        <button className={styles.send}>Send</button>
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
  );
};

export default RestClient;
