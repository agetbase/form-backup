import { Text, VStack } from '@vapor-ui/core';

import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <VStack
      render={
        <footer>
          <Text foreground="normal-100" typography="body2">
            Released under the MIT License.
          </Text>

          <Text foreground="normal-100" typography="body2">
            Copyright © 2025 agetbase
          </Text>
        </footer>
      }
      padding="$400"
      alignItems="center"
      className={styles.footer}
    />
  );
}
