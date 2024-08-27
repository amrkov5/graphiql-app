'use client';

import { useEffect, useState } from 'react';
import MethodSelector from '../MethodSelector/MethodSelector';
import { useRouter } from 'next/navigation';
import EndpointInput from '../EndpointInput/EndpointInput';
import styles from './RestClient.module.css';

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
  const router = useRouter();
  const [method, setMethod] = useState(propMethod);
  const [url, setUrl] = useState(propUrl ?? '');
  const [body, setBody] = useState(propBody ?? '');
  useEffect(() => {
    let newUrl = '/' + method;
    if (url) newUrl += '/' + url;
    if (body) newUrl += '/' + body;
    router.replace(newUrl);
  }, [method, url, body]);
  return (
    <main className={styles.container}>
      <MethodSelector method={method} setMethod={setMethod} />
      <EndpointInput url={url} setUrl={setUrl} />
      <button className={styles.send}>Send</button>
    </main>
  );
};

export default RestClient;
