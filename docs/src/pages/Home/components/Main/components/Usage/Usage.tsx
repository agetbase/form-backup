import { useEffect, useMemo, useState } from 'react';

import { HStack } from '@vapor-ui/core';

import { createFormBackup } from 'form-backup';
import { ControlsAndMonitoring, LiveDemo } from './components';

export const skills = [
  { value: 'React.js', label: 'React.js' },
  { value: 'Vue.js', label: 'Vue.js' },
  { value: 'Angular.js', label: 'Angular.js' },
  { value: 'Vanilla js', label: 'Vanilla JS' },
] as const;

export type Skill = (typeof skills)[number]['value'];

export type FormData = {
  name: string;
  email: string;
  skills: Skill[];
  message: string;
  newsletter: boolean;
};

export const initialiFormData = {
  name: '',
  email: '',
  skills: [],
  message: '',
  newsletter: false,
};
export const INITIAL_TTL = 1_000 * 30;
export const INTERVAL_TIME = 1_000;
export const TTL_STORAGE_KEY = 'usage-demo-ttl';

const getStoredTTL = (): number => {
  try {
    const stored = sessionStorage.getItem(TTL_STORAGE_KEY);

    if (stored) {
      const parsedTTL = Number.parseInt(stored);

      if (parsedTTL > 0) {
        return parsedTTL;
      }
    }
  } catch (error) {
    console.warn('Failed to read TTL from sessionStorage:', error);
  }

  return INITIAL_TTL;
};

export default function Usage() {
  const [formData, setFormData] = useState<FormData>(initialiFormData);
  const [storageType, setStorageType] = useState<'local' | 'session'>('local');
  const [remainingTTL, setRemainingTTL] = useState(0);
  const [storageData, setStorageData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [ttl, setTTL] = useState(() => getStoredTTL());

  const backup = useMemo(
    () =>
      createFormBackup('usage-demo-form', {
        ttl,
        storage: storageType,
      }),
    [ttl, storageType]
  );

  const updateStorageInfo = () => {
    const data = backup.restore();
    setStorageData(data);
    setRemainingTTL(backup.getRemainingTTL() || 0);
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(TTL_STORAGE_KEY, ttl.toString());
    } catch (error) {
      console.warn('Failed to save TTL to sessionStorage:', error);
    }
  }, [ttl]);

  useEffect(() => {
    const restored = backup.restore();

    if (restored) {
      setFormData({
        name: (restored.name as string) || '',
        email: (restored.email as string) || '',
        skills: Array.isArray(restored.skills) ? restored.skills : [],
        message: (restored.message as string) || '',
        newsletter: Boolean(restored.newsletter || false),
      });
    }

    updateStorageInfo();

    const interval = setInterval(updateStorageInfo, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, [backup, storageType]);

  return (
    <HStack width="100%" gap="$400" justifyContent="center">
      <LiveDemo
        backup={backup}
        setFormData={setFormData}
        formData={formData}
        updateStorageInfo={updateStorageInfo}
      />
      <ControlsAndMonitoring
        storageType={storageType}
        setStorageType={setStorageType}
        backup={backup}
        setFormData={setFormData}
        remainingTTL={remainingTTL}
        storageData={storageData}
        ttl={ttl}
        setTTL={setTTL}
        updateStorageInfo={updateStorageInfo}
      />
    </HStack>
  );
}
