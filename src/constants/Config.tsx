import { Chain, bscTestnet, polygon } from 'viem/chains';
import { GlobalFiUpgradeable } from './ContractAddress';

export const ProjectName = 'GlobalFi';

export const MinContribution = 20;

export type SupportedNetworkInfoType = {
  [key: number]: {
    icon: string;
    currencyName: string;
    referralContract: `0x${string}`;
    chainInfo: Chain;
    tokens: {
      [key: string]: TokenInfoType;
    };
  };
};

export type TokenInfoType = {
  contractAddress: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
};

export const supportedNetworkInfo: SupportedNetworkInfoType = {
  [bscTestnet.id]: {
    icon: '/currencyLogos/bnb.svg',
    currencyName: 'tBNB',
    referralContract: GlobalFiUpgradeable?.contractAddress?.[97],
    chainInfo: bscTestnet,
    tokens: {
      ['USDT']: {
        contractAddress: '0xDAE0b6BC392004435bC6743bf2443D17b095D7E7',
        name: 'Tether',
        symbol: 'USDT',
        decimals: 18,
      },
    },
  },

  [polygon?.id]: {
    icon: '/currencyLogos/polygon.svg',
    currencyName: 'MATIC',
    referralContract: GlobalFiUpgradeable?.contractAddress?.[137],
    chainInfo: polygon,
    tokens: {
      ['USDT']: {
        contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        name: 'Tether',
        symbol: 'USDT',
        decimals: 6,
      },
    },
  },
};
