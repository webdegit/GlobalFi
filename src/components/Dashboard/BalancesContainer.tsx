import { HStack, Icon, Image, Spacer, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export const BalancesContainer = ({
  image,
  icon,
  heading,
  balance,
  balaceCurrencyImage
}: {
  image?: string;
  icon?: IconType;
  heading: string;
  balance: number;
  balaceCurrencyImage?: string
}) => {
  return (
    <HStack w="full">
      {image && <Image src={image} w={7}></Image>}
      {icon && <Icon as={icon} w={7}></Icon>}
      <Text>{heading}</Text>
      <Spacer />
      <Text>{balance}</Text>
      {balaceCurrencyImage && <Image src={balaceCurrencyImage} w={5}></Image>}
    </HStack>
  );
};
