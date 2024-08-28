import { Dispatch, SetStateAction, useState } from 'react';
import styles from './EndpointInput.module.css';

interface EndpointInputProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
}

const EndpointInput: React.FC<EndpointInputProps> = ({ url, setUrl }) => {
  const [localUrl, setLocalUrl] = useState(atob(decodeURIComponent(url)));

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const encodedUrl = btoa(event.target.value);
    setLocalUrl(event.target.value);
    setUrl(encodedUrl);
  };

  return (
    <input
      type="text"
      value={localUrl}
      onChange={handleEndpointChange}
      placeholder="Enter endpoint URL"
      className={styles.input}
      name="url"
    />
  );
};

export default EndpointInput;
