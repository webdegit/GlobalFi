import {
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  Wrap,
} from '@chakra-ui/react';
import React from 'react';
import { ProjectName } from '../../constants/Config';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionIcon = motion(Icon);
const MotionImage = motion(Image);

export const Header = () => {
  return (
    <Wrap
      w="full"
      justify={'space-around'}
      minH={'95vh'}
      py={20}
      spacing={10}
      align="center"
    >
      <Flex direction="column" gap={10} px={5}>
        <Text
          fontSize={['7xl', '8xl', '9xl']}
          lineHeight={1}
          fontWeight={900}
          color="pink.500"
        >
          {ProjectName}
        </Text>
        <Heading maxW="35ch">
          100% Fully Decentralized Reward Distribution Protocol built on secured
          smart contracts.
        </Heading>
        <Button
          size="lg"
          rightIcon={
            <MotionIcon
              animate={{
                x: [5, 0, 5],
                transition: {
                  repeat: Infinity,
                  duration: 1,
                },
              }}
              as={ArrowForwardIcon}
            ></MotionIcon>
          }
          py={10}
          colorScheme="purple"
          bg="purple.500"
          _hover={{
            bg: 'purple.400',
          }}
          //   bgGradient='linear(to-r, red.500, yellow.500, blue)'
          borderRadius="full"
          //   color="white"
          as={Link}
          to="/register"
          maxW={400}
        >
          Register Now
        </Button>
      </Flex>
      <MotionImage
        animate={{
          y: [5, 0, 5],
          x: [5, 0, 5],
          transition: {
            repeat: Infinity,
            duration: 1,
          },
        }}
        src="/header.png"
        maxW={500}
        w="full"
      ></MotionImage>
    </Wrap>
  );
};
