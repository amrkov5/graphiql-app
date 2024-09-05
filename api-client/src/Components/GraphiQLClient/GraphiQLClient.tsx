'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import EndpointInput from '../EndpointInput/EndpointInput';
import { debounce } from 'lodash';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import BodyEditor from '../BodyEditor/BodyEditor';
import ResponseSection from '../ResponseSection/ResponseSection';
import { useTranslations } from 'next-intl';
import styles from './GraphiQLClient.module.css';
import KeyValueEditor, { KeyValuePair } from '../KeyValueEditor/KeyValueEditor';

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

  const handleRequestSend = async () => {};

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
        </div>
        <div className={styles.editors}>
          <KeyValueEditor
            name={t('bodyVariables')}
            keyValues={variables}
            setKeyValues={setVariables}
          />
          <HeadersEditor />
        </div>
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
