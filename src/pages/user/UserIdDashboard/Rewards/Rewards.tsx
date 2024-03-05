import React from 'react';
import { DashboardDataContainer } from '../../../../components/Dashboard/DashboardDataContainer';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { VStack } from '@chakra-ui/react';
import { BalancesContainer } from '../../../../components/Dashboard/BalancesContainer';
import { HiUserPlus } from 'react-icons/hi2';
import { MdPool } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import {
  UserIdAccountType,
  useGetIdAccount,
} from '../../../../hooks/useReferralContract';
import { weiToDecimals } from '../../../../utils/weiToDecimals';

export const Rewards = () => {
  const { userId } = useParams();
  const userIdAccount = useGetIdAccount(userId ?? 0)
    ?.data as unknown as UserIdAccountType;
  return (
    <VStack>
      <DashboardDataContainer
        heading="Rewards"
        icon={FaHandHoldingHeart}
        children={
          <VStack spacing={5}>
            <BalancesContainer
              // image={`${currentNetwork?.icon}`}
              icon={HiUserPlus}
              heading="Referral"
              balance={weiToDecimals(userIdAccount?.rewards?.referralRewards)}
              balaceCurrencyImage={`/currencyLogos/usdt.svg`}
            />
            <BalancesContainer
              // image={`/currencyLogos/usdt.svg`}
              icon={MdPool}
              heading="Pool"
              balance={weiToDecimals(userIdAccount?.rewards?.globalRewards)}
              balaceCurrencyImage={`/currencyLogos/usdt.svg`}
            />
          </VStack>
        }
      ></DashboardDataContainer>
    </VStack>
  );
};
