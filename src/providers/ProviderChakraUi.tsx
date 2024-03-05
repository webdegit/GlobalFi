import {
  ChakraProvider,
  StyleFunctionProps,
  extendTheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import React, { ReactNode } from 'react';

const theme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('white', 'blackAlpha.900')(props),
      },
    }),
  },
});

export const ProviderChakraUi = ({ children }: { children: ReactNode }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
