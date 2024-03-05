'use client';

import { ReactNode } from 'react';

import {
  Box,
  Circle,
  Container,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Wrap,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { Logo } from './Logo';
import { AiFillTwitterCircle } from 'react-icons/ai';
import {
  FaDiscord,
  FaGithub,
  FaTelegram,
  FaTelegramPlane,
  FaTwitter,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

const SocialMediaIcons = ({
  icon,
  link,
}: {
  icon: IconType;
  link?: string;
}) => {
  return (
    <Circle
      size={12}
      borderWidth="thin"
      borderColor="pink.500"
      cursor="pointer"
      _hover={{
        borderWidth: 'thick',
      }}
    >
      <Icon as={icon} boxSize={4}></Icon>
    </Circle>
  );
};

export default function Footer() {
  return (
    <Box
      //   bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      // borderTopRadius={[50, 75]}
      //   borderColor="pink.600"
      borderTopWidth="thin"
      w="full"
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <Wrap spacing={6}>
          <Stack spacing={6} w="max-content">
            <Flex direction="column" gap={3}>
              <Logo
                isFull={true}
              ></Logo>
              <Text fontSize="lg" maxW={['30ch', '50ch']}>
                © 2023-2024 GlobalFi Network. All rights reserved
              </Text>
            </Flex>
          </Stack>
          <Stack align={'flex-start'}>
            <HStack>
              <SocialMediaIcons icon={FaTwitter}></SocialMediaIcons>
              <SocialMediaIcons icon={FaTelegramPlane}></SocialMediaIcons>
              <SocialMediaIcons icon={FaGithub}></SocialMediaIcons>
              <SocialMediaIcons icon={FaDiscord}></SocialMediaIcons>
            </HStack>
          </Stack>
        </Wrap>
      </Container>
    </Box>
  );
}
