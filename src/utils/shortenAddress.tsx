export const shortenAddress = (address: `0x${string}`): string => {
  const firstString = address.slice(0, 5);
  const seprator = '...';
  const lastString = address.slice(address.length - 3);

  return `${firstString}${seprator}${lastString}`;
};
