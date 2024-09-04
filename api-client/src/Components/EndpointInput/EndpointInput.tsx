import { Dispatch, SetStateAction } from 'react';
import styles from './EndpointInput.module.css';
import { useTranslations } from 'next-intl';

interface EndpointInputProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
}

const EndpointInput: React.FC<EndpointInputProps> = ({ url, setUrl }) => {
  const t = useTranslations('RestClient');
  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const encodedUrl = btoa(event.target.value);
    setUrl(encodedUrl);
  };
  return (
    <input
      type="text"
      value={atob(decodeURIComponent(url))}
      onChange={handleEndpointChange}
      placeholder={t('endpointPlaceholder')}
      className={styles.input}
      name="url"
    />
  );
};

export default EndpointInput;
