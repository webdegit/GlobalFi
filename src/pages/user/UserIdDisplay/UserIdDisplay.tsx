import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  HStack,
  Heading,
  Icon,
  Spacer,
  Spinner,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { FcNeutralDecision } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  UserAccountType,
  useGetUserAccount,
} from '../../../hooks/useReferralContract';

const UserIdCard = ({ userId }: { userId: number }) => {
  return (
    <VStack
      borderRadius="3xl"
      borderWidth="thin"
      minW={150}
      minH={200}
      p={2}
      as={Link}
      to={`/user/userIdDashboard/${userId}`}
      cursor="pointer"
    >
      <HStack>
        <Text>UserId</Text>
        <Spacer />
        <Text fontWeight={900} color="twitter.500">
          #{userId}
        </Text>
      </HStack>
      <Divider />
    </VStack>
  );
};

const InactiveAccountComponent = () => {
  return (
    <VStack>
      <Icon boxSize={100} as={FcNeutralDecision}></Icon>
      <Heading color="red" textAlign="center">
        You account is not active yet.
      </Heading>
      <Text textAlign="center">Please register to activate your account.</Text>
      <Button
        w={250}
        h={14}
        borderRadius="full"
        bg="twitter.500"
        _hover={{
          bg: 'twitter.400',
        }}
        colorScheme="twitter"
        color="white"
        rightIcon={<ArrowForwardIcon />}
        as={Link}
        to="/register"
      >
        Register
      </Button>
    </VStack>
  );
};

export const UserIdDisplay = () => {
  const { address } = useAccount();

  const userAccountHook = useGetUserAccount(address!);

  const userAccount = userAccountHook?.data as unknown as UserAccountType;

  const userIds = userAccount?.ids;
  const regenratedIds = [1, 2, 3, 4, 5, 7, 9];

  return (
    <VStack py={[10, 20]} spacing={10}>
      {userAccountHook?.isFetched ? (
        <>
          {userIds?.length > 0 ? (
            <VStack>
              <VStack>
                <Heading color="pink.500">Your user ids</Heading>
                <Text>Please select an id to go to dashboard.</Text>
              </VStack>
              <Wrap justify="center" align="center">
                {userIds?.map((userId: bigint, key: number) => {
                  return (
                    <UserIdCard userId={Number(userId)} key={key}></UserIdCard>
                  );
                })}
              </Wrap>
              {/* <Divider></Divider>
              <Heading color="green.500">Regenerated User Ids</Heading>
              <Text>Please select an id to go to dashboard.</Text>
              <Wrap justify="center" align="center">
                {regenratedIds?.map((userId, key) => {
                  return (
                    <UserIdCard userId={Number(userId)} key={key}></UserIdCard>
                  );
                })}
              </Wrap> */}
            </VStack>
          ) : (
            <InactiveAccountComponent></InactiveAccountComponent>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </VStack>
  );
};
