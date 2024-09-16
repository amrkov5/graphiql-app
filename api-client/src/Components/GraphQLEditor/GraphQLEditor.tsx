import { Dispatch, SetStateAction, useRef, useState } from 'react';
import styles from './GraphQLEditor.module.css';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useTranslations } from 'next-intl';
import * as prettier from 'https://unpkg.com/prettier@3.3.3/standalone.mjs';
import prettierPluginGraphql from 'https://unpkg.com/prettier@3.3.3/plugins/graphql.mjs';
import { fromBase64, toBase64 } from '@/services/safeBase64';

interface GraphQLEditorProps {
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
}

const GraphQLEditor: React.FC<GraphQLEditorProps> = ({ body, setBody }) => {
  const t = useTranslations('RestClient');
  const [localBody, setLocalBody] = useState(fromBase64(body));
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [error, setError] = useState<string>('');

  editorRef.current?.onDidBlurEditorWidget(() => {
    const encodedBody = toBase64(localBody);
    setBody(encodedBody);
  });

  const handleFormat = async () => {
    try {
      const formatted = await prettier.format(localBody, {
        parser: 'graphql',
        plugins: [prettierPluginGraphql],
      });
      setLocalBody(formatted);
      setBody(toBase64(formatted));
      setError('');
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(e.message.split('\n')[0]);
      }
    }
  };

  return (
    <div data-testid="bodyContainer" className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>{t('body')}</label>
        <div className={styles.controls}>
          <div className={styles.error}>{error}</div>
          <button className={styles.formatButton} onClick={handleFormat}>
            {t('format')}
          </button>
        </div>
      </div>
      <Editor
        className={styles.editor}
        height="40vh"
        language="graphql"
        theme="vs-dark"
        value={localBody}
        onChange={(value) => setLocalBody(value ?? '')}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};

export default GraphQLEditor;
