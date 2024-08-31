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
  const [url, setUrl] = useState(propUrl ?? '');
  const [body, setBody] = useState(propBody ?? '');
  const [queries, setQueries] = useState<KeyValuePair[]>([]);
  const [variables, setVariables] = useState<KeyValuePair[]>([]);
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
  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <MethodSelector method={method} setMethod={setMethod} />
        <EndpointInput url={url} setUrl={setUrl} />
        <button
          className={styles.send}
          onClick={() => {
            const notEmptyQueries = queries.filter(
              (query) => query.key && query.value
            );
            const notEmptyVariables = variables.filter(
              (variable) => variable.key && variable.value
            );
            console.log(notEmptyQueries);
            console.log(notEmptyVariables);
          }}
        >
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
  );
};

export default RestClient;
