import { Flex, HStack, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { ConnectWalletButton } from '../../components/ConnectWalletButton';
import { AiOutlineDisconnect } from 'react-icons/ai';

export const NoAuth = () => {
  return (
    <VStack py={[10, 20]}>
      <Icon as={AiOutlineDisconnect} boxSize={100} color="red"></Icon>
      <Heading color="red">You are not connected.</Heading>
      <Text textAlign="center">Please connect wallet to continue.</Text>
      <ConnectWalletButton />
    </VStack>
  );
};
