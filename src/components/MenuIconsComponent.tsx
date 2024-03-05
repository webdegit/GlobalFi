import {
  Center,
  Icon,
  Tag,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

export const MenuIconsComponent = ({
  heading,
  icon,
  route,
  onClick,
}: {
  heading?: string;
  icon: IconType;
  route: string;
  onClick: () => void;
}) => {
  return (
    <Tag colorScheme="twitter" borderRadius="3xl">
      <Tooltip
        label={heading}
        placement="right-start"
        hasArrow
        p={2}
        borderRadius="xl"
        fontWeight="bold"
      >
        <Center
          boxSize={16}
          // borderWidth="thin"
          // borderRadius="3xl"
          cursor="pointer"
          // borderColor="pink"
          //   boxShadow="base"
          //   bgColor={useColorModeValue('blackAlpha.50', 'blackAlpha.200')}
          as={Link}
          to={route}
          onClick={onClick}
        >
          <Icon as={icon} boxSize={6}></Icon>
        </Center>
      </Tooltip>
    </Tag>
  );
};
