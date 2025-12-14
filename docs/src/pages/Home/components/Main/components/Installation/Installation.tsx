import { useTheme } from '@vapor-ui/core';
import { InstallCommand } from 'react-install-command';

import 'react-install-command/styles.css';

export default function Installation() {
  const { resolvedTheme } = useTheme();

  return <InstallCommand theme={resolvedTheme} packageName="form-backup" />;
}
