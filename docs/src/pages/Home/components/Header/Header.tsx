import { HStack, IconButton, Switch, Text, useTheme } from '@vapor-ui/core';
import { DarkOutlineIcon, LightOutlineIcon } from '@vapor-ui/icons';
import clsx from 'clsx';

import { GitHubIcon, NpmIcon, VerticleDivider } from './components';
import { useScrollDetection } from './Header.hooks';

import styles from './Header.module.scss';

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  const isYScrolled = useScrollDetection();

  return (
    <HStack
      position="fixed"
      width="100%"
      height="$800"
      padding="$400"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="$canvas-100"
      className={clsx(
        styles.header,
        isYScrolled && styles.showHeaderBorderBottom
      )}
    >
      <HStack alignItems="center" gap="$050">
        <img
          height={18}
          src={`${process.env.PUBLIC_URL}/logo_origin.png`}
          alt="form backup logo"
        />

        <Text typography="body1">form-backup</Text>
      </HStack>

      <HStack gap="$050" alignItems="center">
        <Switch.Root
          checked={resolvedTheme === 'dark'}
          onCheckedChange={() => {
            setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
          }}
        >
          <Switch.ThumbPrimitive>
            {resolvedTheme === 'dark' ? (
              <DarkOutlineIcon color="var(--vapor-color-gray-600)" />
            ) : (
              <LightOutlineIcon color="var(--vapor-color-gray-600)" />
            )}
          </Switch.ThumbPrimitive>
        </Switch.Root>

        <VerticleDivider />

        <IconButton
          render={
            <a
              href="https://github.com/agetbase/form-backup"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon
                width={20}
                height={20}
                fill="var(--vapor-color-gray-600)"
              />
            </a>
          }
          className={styles.iconButton}
          aria-label="GitHub"
        />

        <IconButton
          render={
            <a
              href="https://www.npmjs.com/package/form-backup"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NpmIcon
                width={20}
                height={20}
                fill="var(--vapor-color-gray-600)"
              />
            </a>
          }
          className={styles.iconButton}
          aria-label="npm"
        />
      </HStack>
    </HStack>
  );
}
