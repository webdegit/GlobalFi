import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  IconButton,
  Show,
  Text,
  VStack,
  Wrap,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FcGoodDecision } from 'react-icons/fc';
import { HiMenuAlt2 } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { AccountActionButton } from '../AccountActionButton';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { ConnectWalletButton } from '../ConnectWalletButton';
import { MenuIconsComponent } from '../MenuIconsComponent';
import { NavUserMenuObject } from './NavUserMenuObject';
import { FaTelegram, FaTelegramPlane } from 'react-icons/fa';
import { supportedNetworkInfo } from '../../constants/Config';

// const MenuIcons = ({
//   heading,
//   icon,
//   route,
//   onClick,
// }: {
//   heading?: string;
//   icon: IconType;
//   route: string;
//   onClick: () => void;
// }) => {
//   return (
//     <Tooltip
//       label={heading}
//       placement="right-start"
//       hasArrow
//       p={2}
//       borderRadius="xl"
//       fontWeight="bold"
//     >
//       <Center
//         boxSize={16}
//         borderWidth="thin"
//         borderRadius="3xl"
//         cursor="pointer"
//         boxShadow="base"
//         bgColor={useColorModeValue('blackAlpha.50', 'blackAlpha.200')}
//         as={Link}
//         to={route}
//         onClick={onClick}
//       >
//         <Icon as={icon} boxSize={6}></Icon>
//       </Center>
//     </Tooltip>
//   );
// };

const NavUserMenu = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      {NavUserMenuObject.map((menuObject, key) => {
        return (
          <VStack key={key}>
            <MenuIconsComponent
              icon={menuObject?.icon}
              heading={menuObject?.heading}
              route={menuObject?.to}
              onClick={onClose}
            ></MenuIconsComponent>
            <Show below="md">
              <Text>{menuObject?.heading}</Text>
            </Show>
          </VStack>
        );
      })}
    </>
  );
};

export const NavMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const chainId = useChainId();
  const currentNetwork = supportedNetworkInfo[chainId];

  return (
    <>
      <IconButton
        aria-label="Nav Menu Drawer Button"
        icon={<HiMenuAlt2 size={27} />}
        onClick={onOpen}
        size={['md', 'lg']}
        variant="ghost"
        borderRadius="full"
      ></IconButton>
      <Drawer
        isOpen={isOpen}
        placement={useBreakpointValue(
          {
            base: 'bottom',
            md: 'right',
          },
          {
            fallback: 'md',
          }
        )}
        onClose={onClose}
      >
        <DrawerOverlay
          //   bg="blackAlpha.300"
          backdropFilter="blur(10px)"
        />
        <DrawerContent
          //   borderTopRadius="3xl"
          bgColor={useColorModeValue('whiteAlpha.900', '#191A1A')}
          backdropFilter="blur(10px)"
          py={5}
          borderRadius={'100px,0,0,0'}
          borderLeftWidth={useBreakpointValue(
            {
              base: 0,
              md: 'thick',
            },
            {
              fallback: 'base',
            }
          )}
          borderLeftRadius={useBreakpointValue(
            {
              base: 0,
              md: 75,
            },
            {
              fallback: 'md',
            }
          )}
          borderTopWidth={useBreakpointValue(
            {
              base: 'thick',
              md: 0,
            },
            {
              fallback: 'md',
            }
          )}
        >
          <DrawerCloseButton />
          <DrawerHeader>
            {address ? (
              <HStack>
                <ConnectWalletButton onClick={onClose} />
                <AccountActionButton
                  address={address}
                  explorerAddress={
                    currentNetwork?.chainInfo?.blockExplorers?.default?.url
                  }
                />
              </HStack>
            ) : null}
          </DrawerHeader>
          <DrawerBody display="flex" justifyItems="center" alignItems="center">
            <Wrap
              w="full"
              justify="center"
              direction={['row', 'row', 'column']}
            >
              {address ? (
                <NavUserMenu onClose={onClose} />
              ) : (
                <VStack>
                  <Heading color="red">You are not connected.</Heading>
                  <Text>Please connect Wallet to continue...</Text>
                  <ConnectWalletButton onClick={onClose} />
                </VStack>
              )}
            </Wrap>
          </DrawerBody>

          <DrawerFooter display="flex" gap={5} justifyContent="center">
            <VStack>
              <HStack>
                <Button
                  px={10}
                  rightIcon={<FcGoodDecision />}
                  as={Link}
                  to="/register"
                  onClick={onClose}
                  variant="outline"
                  h={14}
                  minW={200}
                  borderRadius="full"
                  colorScheme="green"
                >
                  Register
                </Button>
                <ColorModeSwitcher />
              </HStack>
              <Button
                h={14}
                w={250}
                borderRadius="full"
                leftIcon={<FaTelegramPlane />}
                bgColor="twitter.500"
                _hover={{
                  bgColor: 'twitter.400',
                }}
                colorScheme="twitter"
              >
                Join Telegram
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
