import { AspectRatio, Button, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { supportedNetworkInfo } from '../../../../constants/Config';
import { useAccount, useChainId } from 'wagmi';
import { MainHeading } from '../../../../components/Dashboard/MainHeading';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const Transactions = () => {
  const chainId = useChainId();
  const currentNetwork = supportedNetworkInfo[chainId];
  const { address } = useAccount();

  console.log(
    'Transactions Page',
    `${currentNetwork?.chainInfo?.blockExplorers?.default?.url}/address/${address}`
  );
  return (
    <VStack spacing={10}>
      <MainHeading
        heading="Transactions"
        icon={FaArrowRightArrowLeft}
      ></MainHeading>
      <Button
        as="a"
        target="_black"
        href={`${currentNetwork?.chainInfo?.blockExplorers?.default?.apiUrl}/address/${address}`}
        rightIcon={<ExternalLinkIcon />}
        h={14}
      >
        View transaction on{' '}
        {currentNetwork?.chainInfo?.blockExplorers?.default?.name}
      </Button>
    </VStack>
  );
};
