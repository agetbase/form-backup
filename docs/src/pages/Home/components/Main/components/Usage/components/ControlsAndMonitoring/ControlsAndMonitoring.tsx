import {
  Switch,
  Badge,
  VStack,
  TextInput,
  HStack,
  Text,
  useTheme,
  Button,
} from '@vapor-ui/core';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FormBackup } from 'form-backup';
import { Dispatch, SetStateAction } from 'react';

import { LabelGroup } from '..';
import { initialiFormData, FormData, INITIAL_TTL } from '../../Usage';

import styles from './ControlsAndMonitoring.module.scss';
import {
  RefreshOutlineIcon,
  StorageIcon,
  TimeIcon,
  TrashOutlineIcon,
} from '@vapor-ui/icons';

interface ControlsAndMonitoringProps {
  storageType: 'local' | 'session';
  setStorageType: (type: 'local' | 'session') => void;
  backup: FormBackup;
  setFormData: Dispatch<SetStateAction<FormData>>;
  remainingTTL: number;
  storageData: Record<string, unknown> | null;
  ttl: number;
  setTTL: (ttl: number) => void;
  updateStorageInfo: () => void;
}

export default function ControlsAndMonitoring(
  props: ControlsAndMonitoringProps
) {
  const {
    storageType,
    setStorageType,
    backup,
    setFormData,
    remainingTTL,
    storageData,
    ttl,
    setTTL,
    updateStorageInfo,
  } = props;
  const { resolvedTheme } = useTheme();

  const formatTTL = (ms: number | null) => {
    if (ms === null) return '0s';

    const totalSeconds = Math.floor(ms / 1_000);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.length > 0 ? parts.join(' ') : '0s';
  };

  return (
    <VStack
      render={
        <section>
          <VStack
            gap="$500"
            padding="$300"
            borderRadius="$400"
            backgroundColor="$canvas-200"
          >
            <VStack>
              <VStack gap="$100">
                <Text typography="heading2" color="var(--vapor-color-gray-800)">
                  Controls & Monitoring
                </Text>
                <Text typography="body2" foreground="normal-100">
                  Monitor the status of your storage and clear the data.
                </Text>
              </VStack>
            </VStack>
            <VStack gap="$150">
              <LabelGroup htmlFor="storage-type-switch" label="Storage Type">
                <LabelGroup.Icon>
                  <StorageIcon color="var(--vapor-color-gray-400)" />
                </LabelGroup.Icon>

                <LabelGroup.Slot>
                  <Badge size="sm" shape="pill">
                    {storageType === 'local' && 'Local storage'}
                    {storageType === 'session' && 'Session storage'}
                  </Badge>
                </LabelGroup.Slot>

                <Switch.Root
                  id="storage-type-switch"
                  checked={storageType === 'session'}
                  onCheckedChange={(checked) => {
                    const newType = checked ? 'session' : 'local';
                    setStorageType(newType);
                    backup.clear();
                    setFormData(initialiFormData);
                    updateStorageInfo();
                  }}
                />
              </LabelGroup>

              <LabelGroup
                htmlFor="time-to-live-input"
                label="Time to Live (ms)"
              >
                <LabelGroup.Icon>
                  <TimeIcon color="var(--vapor-color-gray-400)" />
                </LabelGroup.Icon>

                <TextInput
                  id="time-to-live-input"
                  required
                  inputMode="numeric"
                  size="lg"
                  placeholder="9000"
                  value={ttl?.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setTTL(0);
                      return;
                    }
                    const numericValue = value.replace(/[^0-9-]/g, '');
                    if (numericValue === '' || numericValue === '-') {
                      return;
                    }
                    const numValue = Number(numericValue);
                    if (!isNaN(numValue)) {
                      setTTL(numValue);
                    }
                  }}
                  padding="$200"
                />
              </LabelGroup>

              <HStack width="100%" gap="$100">
                <Button
                  colorPalette="secondary"
                  size="lg"
                  width="100%"
                  onClick={() => {
                    backup.clear();
                    updateStorageInfo();
                    setTTL(INITIAL_TTL);
                  }}
                >
                  <TrashOutlineIcon size={18} />
                  Clear
                </Button>

                <Button
                  size="lg"
                  width="100%"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <RefreshOutlineIcon size={18} />
                  Reload
                </Button>
              </HStack>
            </VStack>
          </VStack>

          <VStack
            gap="$300"
            padding="$300"
            borderRadius="$400"
            backgroundColor="$canvas-200"
          >
            <HStack>
              {storageData ? (
                <Badge size="lg" shape="pill" colorPalette="success">
                  Active
                </Badge>
              ) : (
                <Badge size="lg" shape="pill" colorPalette="danger">
                  Empty
                </Badge>
              )}
            </HStack>

            <VStack gap="$150">
              <LabelGroup
                htmlFor="ttl-readonly-input"
                label="Time to Live (ms)"
              >
                <LabelGroup.Icon>
                  <TimeIcon color="var(--vapor-color-gray-400)" />
                </LabelGroup.Icon>

                <TextInput
                  id="ttl-readonly-input"
                  readOnly
                  backgroundColor="$overlay-100"
                  value={formatTTL(remainingTTL)}
                />
              </LabelGroup>

              <LabelGroup label="Data">
                <SyntaxHighlighter
                  language="json"
                  style={resolvedTheme === 'dark' ? vscDarkPlus : vs}
                  className={styles.syntaxHighlighter}
                >
                  {storageData ? JSON.stringify(storageData, null, 2) : '{}'}
                </SyntaxHighlighter>
              </LabelGroup>
            </VStack>
          </VStack>
        </section>
      }
      width="25em"
      gap="$300"
    />
  );
}
