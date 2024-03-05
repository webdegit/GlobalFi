import {
  HStack,
  Heading,
  Hide,
  Image,
  ImageProps,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  isFull = false,
  imageProps,
}: {
  isFull?: boolean;
  imageProps?: ImageProps;
}) => {
  const [isMobile] = useMediaQuery('(max-width: 500px)');
  return (
    <HStack as={Link} to="/">
      {isFull ? (
        <HStack>
          <Image src="/LogoSmall.svg" {...imageProps} h={12}></Image>
          <Heading>GlobalFi</Heading>
        </HStack>
      ) : isMobile ? (
        <Image src="/LogoSmall.svg" {...imageProps} h={12}></Image>
      ) : (
        <HStack>
          <Image src="/LogoSmall.svg" {...imageProps} h={12}></Image>
          <Heading>GlobalFi</Heading>
        </HStack>
      )}
    </HStack>
  );
};
