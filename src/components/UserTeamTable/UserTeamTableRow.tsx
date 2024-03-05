import {
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import React from 'react';
import {
  UserIdAccountType,
  UserTeamType,
  useGetIdAccount,
} from '../../hooks/useReferralContract';
import { shortenAddress } from '../../utils/shortenAddress';
import { AccountActionButton } from '../AccountActionButton';
import { supportedNetworkInfo } from '../../constants/Config';
import { useChainId } from 'wagmi';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const UserTeamTableRow = ({
  teamObject,
}: {
  teamObject: UserTeamType;
}) => {
  const userIdAccount = useGetIdAccount(Number(teamObject?.teamId))
    ?.data as unknown as UserIdAccountType;

  const chainId = useChainId();

  const currentNetwork = supportedNetworkInfo[chainId];
  return (
    <Tr>
      <Td>{Number(teamObject?.teamId)}</Td>
      <Td>
        <HStack>
          <Tooltip label={userIdAccount?.owner} borderRadius="full">
            <Text>{userIdAccount?.owner && shortenAddress(userIdAccount?.owner)}</Text>
          </Tooltip>
          <AccountActionButton
            address={userIdAccount?.owner}
            explorerAddress={
              currentNetwork?.chainInfo?.blockExplorers?.default?.url
            }
          ></AccountActionButton>
          <Button
            rightIcon={<ExternalLinkIcon />}
            borderRadius="full"
            colorScheme="twitter"
            size="sm"
          >
            Dashboard
          </Button>
        </HStack>
      </Td>
      <Td>{Number(teamObject?.teamLevel)}</Td>
      <Td>{Number(userIdAccount?.referrerId)}</Td>
    </Tr>
  );
};
