import { Dispatch, SetStateAction } from 'react';
import styles from './EndpointInput.module.css';
import { useTranslations } from 'next-intl';
import { fromBase64, toBase64 } from '@/services/safeBase64';

interface EndpointInputProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
}

const EndpointInput: React.FC<EndpointInputProps> = ({ url, setUrl }) => {
  const t = useTranslations('RestClient');

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(toBase64(event.target.value));
  };
  return (
    <input
      type="text"
      value={fromBase64(url)}
      onChange={handleEndpointChange}
      placeholder={t('endpointPlaceholder')}
      className={styles.input}
      name="url"
    />
  );
};

export default EndpointInput;
