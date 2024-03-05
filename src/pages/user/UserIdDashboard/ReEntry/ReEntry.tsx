import { Divider, Heading, VStack, Wrap } from '@chakra-ui/react';
import { FaIdCardAlt, FaUser } from 'react-icons/fa';
import { MdPool } from 'react-icons/md';
import { BalancesContainer } from '../../../../components/Dashboard/BalancesContainer';
import { DashboardDataContainer } from '../../../../components/Dashboard/DashboardDataContainer';
import { useParams } from 'react-router-dom';
import {
  UserIdAccountType,
  useGetIdAccount,
} from '../../../../hooks/useReferralContract';
import { weiToDecimals } from '../../../../utils/weiToDecimals';
import { GiEntryDoor } from 'react-icons/gi';
import { MainHeading } from '../../../../components/Dashboard/MainHeading';

const ReEntryIdCard = ({ userId }: { userId: number | string }) => {
  const userIdAccount = useGetIdAccount(userId ?? 0)
    ?.data as unknown as UserIdAccountType;
  return (
    <VStack p={5} borderWidth="thin" borderRadius="3xl" minW={200} minH={200}>
      <Heading size="md">Id</Heading>
      <Heading size="4xl">{Number(userIdAccount?.id)}</Heading>
      <BalancesContainer
        heading="Magic Pool Status"
        balance={Number(userIdAccount?.pool?.currentPool)}
      ></BalancesContainer>
      <BalancesContainer
        heading="Magic Pool Income"
        balance={weiToDecimals(userIdAccount?.rewards?.globalRewards)}
        balaceCurrencyImage={`/currencyLogos/usdt.svg`}
      ></BalancesContainer>
      <BalancesContainer
        heading="SpillOver to"
        balance={Number(userIdAccount?.referrerId)}
        // balaceCurrencyImage={`/currencyLogos/usdt.svg`}
      ></BalancesContainer>
    </VStack>
  );
};

export const ReEntry = () => {
  const { userId } = useParams();
  const userIdAccount = useGetIdAccount(userId ?? 0)
    ?.data as unknown as UserIdAccountType;
  return (
    <VStack spacing={10}>
      <MainHeading heading="Re-Entries" icon={GiEntryDoor}></MainHeading>
      {userIdAccount?.regenratedIds?.regenratedIds?.length > 0 ? (
        <VStack p={5} borderWidth="thin" borderRadius="3xl">
          <Heading size="sm">Total Re-Entries Count</Heading>
          <Heading size="4xl">
            {userIdAccount?.regenratedIds?.regenratedIds?.length}
          </Heading>
        </VStack>
      ) : (
        <Heading color="red">You have no Re-Entries.</Heading>
      )}

      {userIdAccount?.regenratedIds?.regenratedIds?.length > 0 && (
        <VStack spacing={10}>
          <Divider></Divider>
          <Heading size="md">Re-Entries Details</Heading>
          <Wrap>
            {userIdAccount?.regenratedIds?.regenratedIds?.map((id, key) => {
              return (
                <ReEntryIdCard userId={Number(id)} key={key}></ReEntryIdCard>
              );
            })}
          </Wrap>
        </VStack>
      )}
    </VStack>
  );
};
