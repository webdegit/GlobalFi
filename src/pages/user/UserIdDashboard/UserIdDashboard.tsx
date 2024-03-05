import {
  Flex,
  Hide,
  VStack,
  Wrap
} from '@chakra-ui/react';
import { Outlet, useParams } from 'react-router-dom';
import { NavUserIdDashboard } from '../../../components/Nav/NavUserIdDashboard/NavUserIdDashboard';
import { NavUserIdMobile } from '../../../components/Nav/NavUserIdDashboard/NavUserIdMobile';

export const UserIdDashboard = () => {
  const { userId } = useParams();
  return (
    <VStack w="full">
      <Hide above="md">
        <NavUserIdMobile userId={userId ?? 0} />
      </Hide>
      <Wrap w="full" py={5} px={5}>
        <Hide below="md">
          <NavUserIdDashboard userId={userId ?? 0} />
        </Hide>
        <Flex
          flex={1}
          w="full"
          p={5}
          direction="column"
          gap={5}
          borderWidth="thin"
          borderRadius="3xl"
        >
          <Outlet />
        </Flex>
      </Wrap>
    </VStack>
  );
};
