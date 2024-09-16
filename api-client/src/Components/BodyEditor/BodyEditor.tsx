import { Dispatch, SetStateAction, useRef, useState } from 'react';
import styles from './BodyEditor.module.css';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useTranslations } from 'next-intl';
import { fromBase64, toBase64 } from '@/services/safeBase64';

interface BodyEditorProps {
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
}

const BodyEditor: React.FC<BodyEditorProps> = ({ body, setBody }) => {
  const t = useTranslations('RestClient');
  const [localBody, setLocalBody] = useState(fromBase64(body));
  const [language, setLanguage] = useState<'json' | 'plaintext'>('json');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  editorRef.current?.onDidBlurEditorWidget(() => {
    const encodedBody = toBase64(localBody);
    setBody(encodedBody);
  });

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor="editorLanguage">
          {t('body')}
        </label>
        <div className={styles.controls}>
          <select
            id="editorLanguage"
            className={styles.languageSelector}
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as 'json' | 'plaintext')
            }
          >
            <option value="json">JSON</option>
            <option value="plaintext">Plain Text</option>
          </select>
          <button className={styles.formatButton} onClick={handleFormat}>
            {t('format')}
          </button>
        </div>
      </div>
      <Editor
        className={styles.editor}
        height="40vh"
        language={language}
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

export default BodyEditor;
