import { Center, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { NetworkSwitchButton } from '../../components/NetworkSwitchButton';

export const UnsupportedNetwork = () => {
  return (
    <Center w="full" minH="100vh">
      <VStack>
        <Heading color="pink.500">Network not supported</Heading>
        <NetworkSwitchButton />
      </VStack>
    </Center>
  );
};
