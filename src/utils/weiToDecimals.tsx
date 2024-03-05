export const weiToDecimals = (weiValue: string | number | bigint | undefined) => {
  const decimals = 18;
  const weiToDecimals = weiValue ? Number(weiValue) / 10 ** decimals : 0;
  return Number(Number(weiToDecimals)?.toFixed(3));
};

