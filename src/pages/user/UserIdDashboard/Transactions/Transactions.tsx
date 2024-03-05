import { AspectRatio, Button, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { supportedNetworkInfo } from '../../../../constants/Config';
import { useAccount, useChainId } from 'wagmi';
import { MainHeading } from '../../../../components/Dashboard/MainHeading';
import { FaArrowRight } from 'react-icons/fa';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const Transactions = () => {
  const chainId = useChainId();
  const currentNetwork = supportedNetworkInfo[chainId];
  const { address } = useAccount();

  const bscScanUrl = 'https://testnet.bscscan.com';

  console.log(
    'Transactions Page',
    `${bscScanUrl}/address/${address}`
  );
  return (
    <VStack spacing={10}>
      <MainHeading
        heading="Transactions"
        icon={FaArrowRight}
      ></MainHeading>
      <Button
        as="a"
        target="_blank"
        href={`${bscScanUrl}/address/${address}`}
        rightIcon={<ExternalLinkIcon />}
        h={14}
      >
        View transaction on BscScan
      </Button>
    </VStack>
  );
};
