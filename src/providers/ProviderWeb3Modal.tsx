import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { bscTestnet, polygon } from 'wagmi/chains';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '78373dcc82967fe7d1a0b0ae32179dd0';

// 2. Create wagmiConfig
const metadata = {
  name: 'GlobalFi',
  description: 'A fully decentralized reward distribution protocol.',
  url: 'https://globalfi.org', // origin must match your domain & subdomain
  icons: ['/LogoSmall.svg'],
};

const chains = [polygon, bscTestnet];
const config = defaultWagmiConfig({
  // @ts-ignore
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
  //   ...wagmiOptions, // Optional - Override createConfig parameters
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  // @ts-ignore
  chains,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function ProviderWeb3Modal({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
