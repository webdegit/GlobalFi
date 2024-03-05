import { VStack } from '@chakra-ui/react';
import React from 'react';
import { RegistrationUi } from '../../components/RegistrationUI/RegistrationUi';

export const Registration = () => {
  return (
    <VStack w="full" minH="100vh" pt={100}>
      <RegistrationUi />
    </VStack>
  );
};
