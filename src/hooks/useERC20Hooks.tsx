import { useChainId, useReadContract } from 'wagmi';
import ReferralContractABI from '../contracts/artifacts/contracts/GlobalFI.sol/GlobalFi.json';
import { supportedNetworkInfo } from '../constants/Config';
import { erc20Abi } from 'viem';

export const useReadContractHook = (
  contractAddress: `0x${string}`,
  functionName:
    | 'symbol'
    | 'name'
    | 'allowance'
    | 'balanceOf'
    | 'decimals'
    | 'totalSupply'
    | undefined,
  args:
    | readonly []
    | readonly [`0x${string}`, `0x${string}`]
    | readonly [`0x${string}`]
    | undefined
) => {
  // @ts-ignore
  const result = useReadContract({
    abi: erc20Abi,
    address: contractAddress,
    functionName: functionName,
    args: args ?? [],
  });

  return result;
};

export const useGetEUSDTAllowance = ( address: `0x${string}` | undefined, spender: `0x${string}`) => {
  const chainId = useChainId();
  const currentNetwork = supportedNetworkInfo[chainId];
  const result = useReadContractHook(currentNetwork?.tokens?.["USDT"]?.contractAddress, "allowance", [address!, spender]);

  return result;
};
