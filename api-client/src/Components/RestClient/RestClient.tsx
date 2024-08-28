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
  }, [method, url, body]);
  return (
    <main className={styles.container}>
      <div className={styles.inputSection}>
        <MethodSelector method={method} setMethod={setMethod} />
        <EndpointInput url={url} setUrl={setUrl} />
        <button className={styles.send}>Send</button>
      </div>
      <HeadersEditor />
      <BodyEditor body={body} setBody={setBody} />
    </main>
  );
};

export default RestClient;
