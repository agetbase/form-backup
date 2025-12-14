import React, { PropsWithChildren, ReactNode } from 'react';
import { Flex, HStack, Text, VStack } from '@vapor-ui/core';
import { BreakpointIcon } from '@vapor-ui/icons';

import styles from './LabelGroup.module.scss';

interface LabelGroupProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

export default function LabelGroup(props: LabelGroupProps) {
  const { htmlFor, label, required, children } = props;

  const childrenArray = React.Children.toArray(children);

  const labelIconChildren: ReactNode[] = [];
  const slotChildren: ReactNode[] = [];
  const contentChildren: ReactNode[] = [];

  childrenArray.forEach((child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    switch (child.type) {
      case LabelGroupIcon:
        labelIconChildren.push(child);
        break;
      case LabelGroupSlot:
        slotChildren.push(child);
        break;
      default:
        contentChildren.push(child);
        break;
    }
  });

  return (
    <VStack gap="$050">
      <HStack alignItems="center" gap="$100">
        <HStack position="relative" alignContent="center" gap="$050">
          {labelIconChildren}

          <Text
            render={<label htmlFor={htmlFor}>{label}</label>}
            typography="body2"
            color="var(--vapor-color-gray-700)"
          />

          {required && (
            <BreakpointIcon
              size={5}
              color="var(--vapor-color-red-400)"
              className={styles.requiredIcon}
            />
          )}
        </HStack>

        {slotChildren}
      </HStack>

      {contentChildren}
    </VStack>
  );
}

function LabelGroupIcon({ children }: PropsWithChildren) {
  return <Flex alignItems="center">{children}</Flex>;
}

function LabelGroupSlot({ children }: PropsWithChildren) {
  return <>{children}</>;
}

LabelGroup.Icon = LabelGroupIcon;
LabelGroup.Slot = LabelGroupSlot;
