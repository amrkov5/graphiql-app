import { Dispatch, SetStateAction, useState } from 'react';
import styles from './EndpointInput.module.css';

interface EndpointInputProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
}

const EndpointInput: React.FC<EndpointInputProps> = ({ url, setUrl }) => {
  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const encodedUrl = btoa(event.target.value);
    setUrl(encodedUrl);
  };

  return (
    <input
      autoFocus={true}
      type="text"
      value={atob(decodeURIComponent(url))}
      onChange={handleEndpointChange}
      placeholder="Enter endpoint URL"
      className={styles.input}
    />
  );
};

export default EndpointInput;
