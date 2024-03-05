import { useChainId, useReadContract } from 'wagmi';
import ReferralContractABI from '../contracts/artifacts/contracts/GlobalFI.sol/GlobalFi.json';
import { supportedNetworkInfo } from '../constants/Config';

export const useReadContractHook = (functionName: string, args: any[]) => {
  const chainId = useChainId();
  const currentNetwork = supportedNetworkInfo[chainId];
  // @ts-ignore
  const result = useReadContract({
    abi: ReferralContractABI?.abi,
    address: currentNetwork?.referralContract,
    functionName: functionName,
    args: args ?? [],
    blockTag: 'latest',
  });
  return result;
};

export type UserTeamType = {
  teamId: bigint;
  teamLevel: bigint;
};

export type RefereeType = {
  refereeId: bigint;
  assignedTo: bigint;
  assignedFrom: bigint;
};

export type UserIdAccountType = {
  id: bigint;
  owner: `0x${string}`;
  referrerId: bigint;
  parentId: bigint;
  refereeIds: RefereeType[];
  team: UserTeamType[];
  business: {
    directBusiness: bigint;
    selfBusiness: bigint;
    teamBusiness: bigint;
  };
  rewards: {
    globalRewards: bigint;
    referralRewards: bigint;
    spillOverRewards: bigint;
  };
  pool: {
    isInPool: boolean;
    currentPool: bigint;
    currentPoolIndex: bigint;
  };
  regenratedIds: {
    isThisRegenerated: boolean;
    regenratedIds: bigint[];
    regeneratedIdBy: bigint;
  };
};

export type PoolStructType = {
  poolId: bigint;
  rewardToDistribute: bigint;
  idsToRegenerate: bigint;
  minUserCounter: bigint;
  count: bigint;
  userCountToUpgrade: bigint;
  userIds: bigint[];
  totalRewardDistributed: bigint;
};

export type UserAccountType = {
  selfAddress: `0x${string}`;
  ids: bigint[];
};

export const useGetUserAccount = (address: `0x${string}`) => {
  const result = useReadContractHook('getUserAccount', [address]);
  return result;
};

export const useGetIdAccount = (id: string | number) => {
  const result = useReadContractHook('getIdAccount', [id]);
  return result;
};

export const useGetPoolById = (id: string | number) => {
  const result = useReadContractHook('getPools', [id]);
  return result;
};
