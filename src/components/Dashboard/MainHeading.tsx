import { HStack, Heading, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export const MainHeading = ({
  heading,
  icon,
}: {
  heading: string;
  icon: IconType;
}) => {
  return (
    <HStack>
      <Heading color="pink.500">{heading}</Heading>
      <Icon as={icon} boxSize={8} color="twitter.500"></Icon>
    </HStack>
  );
};
