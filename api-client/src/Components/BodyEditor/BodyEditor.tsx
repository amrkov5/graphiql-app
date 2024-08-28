import { Dispatch, SetStateAction, useState } from 'react';
import styles from './BodyEditor.module.css';

interface BodyEditorProps {
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
}

const BodyEditor: React.FC<BodyEditorProps> = ({ body, setBody }) => {
  const [localBody, setLocalBody] = useState(atob(decodeURIComponent(body)));

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const encodedBody = btoa(event.target.value);
    setBody(encodedBody);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Body</label>
      <textarea
        value={localBody}
        onChange={(event) => setLocalBody(event.target.value)}
        onBlur={handleBodyChange}
        placeholder="Enter request body"
        className={styles.textarea}
      />
    </div>
  );
};

export default BodyEditor;
