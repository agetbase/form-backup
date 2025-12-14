import { Badge, Box, Button, HStack, Text, VStack } from '@vapor-ui/core';
import { useState } from 'react';
import clsx from 'clsx';

import { Installation, Usage } from './components';

import styles from './Main.module.scss';

enum SelectedTab {
  Usage = 'usage',
  Installation = 'installation',
}

export default function Main() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>(
    SelectedTab.Usage
  );

  return (
    <VStack
      render={
        <main>
          <HStack width="100%" alignItems="center">
            <VStack
              render={
                <Text
                  color="var(--vapor-color-gray-800)"
                  render={
                    <h1 className={styles.titleGroup}>
                      <span className={styles.title}>form-backup</span>
                      <span>Easy form data backup utility library</span>
                    </h1>
                  }
                />
              }
              width="20rem"
            />

            <Box width="35rem" display="flex" justifyContent="center">
              <img
                height={160}
                src={`${process.env.PUBLIC_URL}/logo_origin.png`}
                alt="form backup logo"
                className={styles.logo}
              />
            </Box>
          </HStack>

          <VStack width="100%" gap="$800">
            <HStack gap="$100">
              <Button
                render={
                  <Badge
                    shape="pill"
                    className={clsx(
                      styles.usageButton,
                      selectedTab === SelectedTab.Usage &&
                        styles.isActiveUsageButton
                    )}
                    onClick={() => setSelectedTab(SelectedTab.Usage)}
                  >
                    Usage
                  </Badge>
                }
                className={styles.usageButton}
              />

              <Button
                render={
                  <Badge
                    paddingX="$250"
                    shape="pill"
                    className={clsx(
                      styles.installationButton,
                      selectedTab === SelectedTab.Installation &&
                        styles.isActiveInstallationButton
                    )}
                    onClick={() => setSelectedTab(SelectedTab.Installation)}
                  >
                    Installation
                  </Badge>
                }
                className={styles.installationButton}
              />
            </HStack>

            {selectedTab === SelectedTab.Usage && <Usage />}
            {selectedTab === SelectedTab.Installation && <Installation />}
          </VStack>
        </main>
      }
      width="73rem"
      paddingTop="10rem"
      marginX="auto"
      marginBottom="8rem"
      alignItems="center"
      gap="$500"
    />
  );
}
