import {
  Box,
  Divider,
  HStack,
  Heading,
  Spacer,
  Tag,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { FaIdCardAlt, FaUser } from 'react-icons/fa';
import { MdPool, MdSpaceDashboard } from 'react-icons/md';
import { BalancesContainer } from '../../../../components/Dashboard/BalancesContainer';
import { DashboardDataContainer } from '../../../../components/Dashboard/DashboardDataContainer';
import { useParams } from 'react-router-dom';
import {
  PoolStructType,
  UserIdAccountType,
  useGetIdAccount,
  useGetPoolById,
} from '../../../../hooks/useReferralContract';
import { weiToDecimals } from '../../../../utils/weiToDecimals';
import { GiEntryDoor } from 'react-icons/gi';

import { MainHeading } from '../../../../components/Dashboard/MainHeading';

const poolNames = [
  'Superior Club',
  'Premier Club',
  'Supreme Club',
  'Noble Club',
  'Grand Club',
  'Elite Club',
  'Divine Club',
  'Diamond Club',
];

const poolCount: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

const PoolDisplayComponent = ({
  userIdAccount,
  poolId,
}: {
  userIdAccount: UserIdAccountType;
  poolId: number;
}) => {
  const poolAccountById = useGetPoolById(poolId)
    ?.data as unknown as PoolStructType;
  return (
    <Tag
      borderColor={
        poolId < Number(userIdAccount?.pool?.currentPool)
          ? 'green'
          : poolId === Number(userIdAccount?.pool?.currentPool)
          ? 'yellow'
          : '-moz-initial'
      }
      borderRadius="3xl"
      colorScheme="twitter"
    >
      <VStack p={5} minH={200} minW={350} borderRadius="3xl">
        <HStack w="full">
          <Text>Status</Text>
          <Spacer />

          {poolId < Number(userIdAccount?.pool?.currentPool) ? (
            <Tag size="sm" colorScheme="green">
              <HStack>
                <Text>Achieved</Text>
                <Box boxSize={2} bgColor="green.300" borderRadius="full"></Box>
              </HStack>
            </Tag>
          ) : poolId === Number(userIdAccount?.pool?.currentPool) ? (
            <Tag size="sm" colorScheme="yellow">
              <HStack>
                <Text>In current pool</Text>
                <Box boxSize={2} bgColor="red.300" borderRadius="full"></Box>
              </HStack>
            </Tag>
          ) : (
            <Tag size="sm" colorScheme="red">
              <HStack>
                <Text>Pending</Text>
                <Box boxSize={2} bgColor="red.300" borderRadius="full"></Box>
              </HStack>
            </Tag>
          )}

          {/* <Box
            boxSize={4}
            bgColor={
              index < Number(userIdAccount?.pool?.currentPool)
                ? 'green.300'
                : 'red.300'
            }
            borderRadius="full"
          ></Box> */}
        </HStack>
        <HStack w="full">
          <Heading size="sm">{poolNames[poolId - 1]}</Heading>
          <Spacer />
          <Heading size="sm">#{poolId}</Heading>
        </HStack>
        <Divider />
        <BalancesContainer
          heading="Rewards"
          balance={weiToDecimals(poolAccountById?.rewardToDistribute)}
          balaceCurrencyImage={`/currencyLogos/usdt.svg`}
        ></BalancesContainer>
        <BalancesContainer
          heading="Re-Entries"
          balance={Number(poolAccountById?.idsToRegenerate)}
          // balaceCurrencyImage={`/currencyLogos/usdt.svg`}
        ></BalancesContainer>
        <BalancesContainer
          heading="Total Reward Distributed"
          balance={weiToDecimals(poolAccountById?.totalRewardDistributed)}
          balaceCurrencyImage={`/currencyLogos/usdt.svg`}
        ></BalancesContainer>
        <BalancesContainer
          heading="Total Ids in pool"
          balance={Number(poolAccountById?.userIds?.length)}
          // balaceCurrencyImage={`/currencyLogos/usdt.svg`}
        ></BalancesContainer>
        {/* <Tag size="lg" colorScheme="green">
          <HStack>
            <Text>Achieved</Text>
            <Box
              boxSize={4}
              bgColor="green.300"
              borderRadius="full"
            ></Box>
          </HStack>
        </Tag> */}
      </VStack>
    </Tag>
  );
};

export const Pool = () => {
  const { userId } = useParams();
  const userIdAccount = useGetIdAccount(userId ?? 0)
    ?.data as unknown as UserIdAccountType;

  return (
    <VStack spacing={10}>
      <MainHeading heading="Pool Status" icon={MdPool}></MainHeading>
      <DashboardDataContainer
        heading="Pool Status"
        icon={MdPool}
        children={
          <VStack spacing={5}>
            <BalancesContainer
              // image={`${currentNetwork?.icon}`}
              icon={MdPool}
              heading="Magic Pool"
              balance={Number(userIdAccount?.pool?.currentPool)}
              // balaceCurrencyImage={`/currencyLogos/usdt.svg`}
            />
            <BalancesContainer
              // image={`${currentNetwork?.icon}`}
              icon={MdPool}
              heading="Magic Pool Income"
              balance={weiToDecimals(userIdAccount?.rewards?.globalRewards)}
              balaceCurrencyImage={`/currencyLogos/usdt.svg`}
            />
            {/* <BalancesContainer
                // image={`/currencyLogos/usdt.svg`}
                icon={GiEntryDoor}
                heading="Re-Entries Dummy"
                balance={3}
                // balaceCurrencyImage={`/currencyLogos/usdt.svg`}
              /> */}
            {/* <BalancesContainer
                // image={`/currencyLogos/usdt.svg`}
                icon={MdPool}
                heading="SpillOver Rewards"
                balance={weiToDecimals(userIdAccount?.rewards?.globalRewards)}
                balaceCurrencyImage={`/currencyLogos/usdt.svg`}
              /> */}
          </VStack>
        }
      ></DashboardDataContainer>
      <Divider />
      <Wrap justify="center">
        {poolCount?.map((index: number, key: number) => {
          return (
            <PoolDisplayComponent
              poolId={index}
              userIdAccount={userIdAccount}
              key={key}
            ></PoolDisplayComponent>
          );
        })}
      </Wrap>
    </VStack>
  );
};