import { Dispatch, SetStateAction } from 'react';
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
      type="text"
      value={atob(decodeURIComponent(url))}
      onChange={handleEndpointChange}
      placeholder="Enter endpoint URL"
      className={styles.input}
      name="url"
    />
  );
};

export default EndpointInput;
