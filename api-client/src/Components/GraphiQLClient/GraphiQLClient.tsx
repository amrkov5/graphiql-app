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
import { buildClientSchema, printSchema } from 'graphql';
// import { buildClientSchema, printSchema } from 'graphql';

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

  const [sdlUrl, setSdlUrl] = useState<string>('');
  const [sdlError, setSdlError] = useState<string>('');
  const [sdl, setSdl] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'response' | 'documentation'>(
    'response'
  );

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
      const serverApiUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api/proxy'
          : 'https://ai-team-api-app.vercel.app/api/proxy';
      const decodedUrl = safeBase64Decode(url);
      const decodedBody = safeBase64Decode(body);

      if (!decodedUrl) {
        setError('URLbase64');
        setStatusCode(null);
        return;
      }

      handleLoadDocs();
      setActiveTab('response');

      const parsedHeaders: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        parsedHeaders[key] = value;
      });

      const vars: Record<string, string> = {};

      let updatedBody = decodedBody;
      variables.forEach(({ key, value }) => {
        vars[key] = value;
        // const placeholder = `$${key}`;

        // if (updatedBody) {
        //   const splittedBody = updatedBody.split(placeholder);
        //   const firstPart = splittedBody.shift();
        //   const secondPart = splittedBody.shift();
        //   if (secondPart) {
        //     splittedBody.unshift(`${firstPart}$${key}${secondPart}`);
        //     updatedBody = splittedBody.join(value);
        //   } else {
        //     splittedBody.unshift(firstPart!);
        //     updatedBody = splittedBody.join(value);
        //   }
        // }
      });
      // console.log(updatedBody);
      const res = await fetch(serverApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullUrl: decodedUrl,
          headers: parsedHeaders,
          body: updatedBody,
          variables: vars,
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

  const handleLoadDocs = async () => {
    const decodedUrl = sdlUrl ? sdlUrl : safeBase64Decode(url) + '?sdl';
    const serverApiUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/proxy'
        : 'https://ai-team-api-app.vercel.app/api/proxy';
    setSdlUrl(decodedUrl);
    try {
      const res = await fetch(serverApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullUrl: decodedUrl,
          method: 'DOCS',
        }),
      });
      const graphqlSchemaObj = buildClientSchema((await res.json()).data);
      setSdl(printSchema(graphqlSchemaObj));
      setSdlError('');
    } catch {
      setSdl('');
      setSdlError('Documentation not found');
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
            value={sdlUrl}
            onChange={(e) => setSdlUrl(e.target.value)}
            id="sdl"
            className={styles.input}
            placeholder="Enter SDL URL"
            type="text"
          />
          <button
            className={styles.getSdl}
            disabled={!Boolean(sdlUrl)}
            onClick={handleLoadDocs}
          >
            GET
          </button>
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
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'response' ? styles.active : ''}`}
            onClick={() => setActiveTab('response')}
          >
            Response
          </button>
          {sdl && (
            <button
              className={`${styles.tab} ${activeTab === 'documentation' ? styles.active : ''}`}
              onClick={() => setActiveTab('documentation')}
            >
              Documentation
            </button>
          )}
        </div>
        {activeTab === 'response' && (
          <ResponseSection
            response={response}
            error={error}
            statusCode={statusCode}
            language="json"
          />
        )}
        {activeTab === 'documentation' && (
          <ResponseSection
            response={sdl}
            error={sdlError}
            statusCode={null}
            language="graphql"
          />
        )}
      </div>
    </div>
  );
};

export default GraphiQLClient;
