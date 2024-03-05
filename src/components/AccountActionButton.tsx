import { CheckIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { HStack, Icon, Link, useClipboard, useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react';

export const AccountActionButton = ({
  address,
  explorerAddress,
}: {
  address?: `0x${string}`;
  explorerAddress?: string;
}) => {
  const { onCopy, hasCopied } = useClipboard(`${address}`);
  const toast = useToast();

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: 'Address copied successfully.',
        description: `${address}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  return (
    <HStack>
      <Icon
        as={hasCopied ? CheckIcon : CopyIcon}
        onClick={onCopy}
        cursor="pointer"
      ></Icon>
      <Link href={`${explorerAddress}/address/${address}`} target="_blank">
        <Icon as={ExternalLinkIcon} cursor="pointer"></Icon>
      </Link>
    </HStack>
  );
};
