import { VStack } from '@chakra-ui/react';
import { FaUser, FaUserFriends } from 'react-icons/fa';
import { FaShop, FaUserGroup } from 'react-icons/fa6';
import { BalancesContainer } from '../../../../components/Dashboard/BalancesContainer';
import { DashboardDataContainer } from '../../../../components/Dashboard/DashboardDataContainer';
import { useParams } from 'react-router-dom';
import { UserIdAccountType, useGetIdAccount } from '../../../../hooks/useReferralContract';
import { weiToDecimals } from '../../../../utils/weiToDecimals';

export const Business = () => {
  const {userId} = useParams()
  const userIdAccount = useGetIdAccount(userId ?? 0)
    ?.data as unknown as UserIdAccountType;
  
  return (
    <DashboardDataContainer
      heading="Business"
      icon={FaShop}
      children={
        <VStack spacing={5}>
          <BalancesContainer
                // image={`${currentNetwork?.icon}`}
                icon={FaUser}
                heading="Self"
                balance={weiToDecimals(userIdAccount?.business?.selfBusiness)}
                balaceCurrencyImage={`/currencyLogos/usdt.svg`}
              />
              <BalancesContainer
                // image={`/currencyLogos/usdt.svg`}
                icon={FaUserFriends}
                heading="Direct"
                balance={weiToDecimals(userIdAccount?.business?.directBusiness)}
                balaceCurrencyImage={`/currencyLogos/usdt.svg`}
              />
              <BalancesContainer
                // image={`/currencyLogos/usdt.svg`}
                icon={FaUserGroup}
                heading="Team"
                balance={weiToDecimals(userIdAccount?.business?.teamBusiness)}
                balaceCurrencyImage={`/currencyLogos/usdt.svg`}
              />
        </VStack>
      }
    ></DashboardDataContainer>
  );
};
