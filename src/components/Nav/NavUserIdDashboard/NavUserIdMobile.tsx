import {
  Box,
  Collapse,
  HStack,
  Heading,
  Icon,
  PopoverArrow,
  Spacer,
  Tag,
  Text,
  VStack,
  flexbox,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { Link, useNavigate } from 'react-router-dom';
import {
  NavUserIdDashboardObject,
  navUserIdDashboardObjectFunction,
} from './NavUserIdDashboardObject';

const CollapseMenu = ({
  heading,
  icon,
  to,
  onClick,
}: {
  heading?: string;
  icon?: IconType;
  to?: string;
  onClick?: () => void;
}) => {
  return (
    <HStack
      w="60vw"
      maxW={900}
      minW={250}
      as={Link}
      to={to}
      onClick={onClick}
      // borderWidth="thin"
      _hover={{
        borderColor: 'pink',
      }}
      //   borderColor="pink"
      p={2}
      borderRadius="3xl"
    >
      <Text>{heading}</Text>
      <Spacer />
      <Icon as={icon} color="pink.500"></Icon>
    </HStack>
  );
};

export const NavUserIdMobile = ({ userId }: { userId: string | number }) => {
  const { isOpen, onOpen, onToggle } = useDisclosure();
  // const [menu, setMenu] = useState(NavUserIdDashboardObject?.[2]);
  const [menu, setMenu] = useState(
    navUserIdDashboardObjectFunction(userId)?.[1]
  );

  return (
    <VStack w="full" px={7}>
      <Tag
        p={5}
        borderRadius="3xl"
        // borderWidth="thick"
        // borderColor="pink"
        onClick={onToggle}
        colorScheme="pink"
      >
        <CollapseMenu
          heading={menu?.heading}
          icon={menu?.icon}
          // to={menu?.heading}
          //   onClick={onToggle}
        ></CollapseMenu>
      </Tag>
      <Collapse in={isOpen} animateOpacity>
        <Tag borderRadius="3xl" colorScheme="twitter">
          <VStack p={2}>
            {/* <PopoverArrow /> */}
            {navUserIdDashboardObjectFunction(userId)?.map(
              (navMenuObject, key) => {
                return (
                  <CollapseMenu
                    key={key}
                    onClick={() => {
                      onToggle();
                      setMenu(navMenuObject);
                    }}
                    heading={navMenuObject?.heading}
                    icon={navMenuObject?.icon}
                    to={navMenuObject?.to}
                  ></CollapseMenu>
                );
              }
            )}
          </VStack>
        </Tag>
      </Collapse>
    </VStack>
  );
};
