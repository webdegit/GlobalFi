import { Heading, VStack } from '@chakra-ui/react';
import React from 'react';

export const NetworkSwitchButton = () => {
  return (
    <VStack>
      <Heading>Please switch to supported network</Heading>
      <w3m-network-button></w3m-network-button>
    </VStack>
  );
};
