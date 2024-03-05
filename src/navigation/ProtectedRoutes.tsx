import { Heading, VStack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { useAccount, useEnsName, useSwitchChain } from 'wagmi';
import { NoAuth } from '../pages/Error';

export const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();
  return <VStack>{address ? children : <NoAuth></NoAuth>}</VStack>;
};
