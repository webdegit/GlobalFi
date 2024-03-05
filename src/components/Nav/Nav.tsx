import { HStack, Hide, Spacer, VStack } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { ConnectWalletButton } from '../ConnectWalletButton';
import { Logo } from '../Logo';
import { NavMenu } from './NavMenu';
import { motion } from 'framer-motion';

const MotionLogo = motion(Logo);

export const Nav = () => {
  return (
    <VStack position="sticky" top={0} borderBottomWidth="thin" zIndex={111}>
      <HStack
        w="full"
        maxW="1500px"
        px={5}
        py={7}
        //   bgColor={useColorModeValue('white', 'gray.900')}
        // borderBottomRadius={[50, 75]}
        //   borderWidth="thin"
        //   borderColor="pink.600"

        backdropFilter="blur(20px)"
        spacing={1}
      >
        <MotionLogo
          imageProps={{
            maxH: [10, 12, 14, 16],
          }}
        ></MotionLogo>
        <Spacer />
        {/* <w3m-button /> */}
        <ConnectWalletButton />
        <NavMenu />
        <Hide below="md">
          <ColorModeSwitcher size={['md', 'lg']} />
        </Hide>
      </HStack>
    </VStack>
  );
};
