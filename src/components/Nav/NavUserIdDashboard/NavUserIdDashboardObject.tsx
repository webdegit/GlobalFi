import { RxDashboard } from 'react-icons/rx';
import {
  FaArrowRightArrowLeft,
  FaArrowsDownToPeople,
  FaIdCardClip,
  FaShop,
} from 'react-icons/fa6';
import { GiEntryDoor, GiReceiveMoney } from 'react-icons/gi';
import { AiFillHome } from 'react-icons/ai';
import { MdPool, MdSpaceDashboard } from 'react-icons/md';

export const NavUserIdDashboardObject = [
  {
    heading: 'Home',
    icon: AiFillHome,
    to: '/',
  },
  {
    heading: 'User Ids',
    icon: FaIdCardClip,
    to: '/user',
  },
  {
    heading: 'Dashboard',
    icon: RxDashboard,
    to: '/dashboard',
  },
  {
    heading: 'Business',
    icon: FaShop,
    to: '/business',
  },
  {
    heading: 'Pool',
    icon: FaShop,
    to: '/pool',
  },
  {
    heading: 'Team',
    icon: FaArrowsDownToPeople,
    to: '/teams',
  },
  {
    heading: 'Rewards',
    icon: GiReceiveMoney,
    to: '/rewards',
  },
];

export const navUserIdDashboardObjectFunction = (userId: string | number) => {
  const NavArray = [
    {
      heading: 'Home',
      icon: AiFillHome,
      to: '/user',
    },
    // {
    //   heading: 'User Ids',
    //   icon: FaIdCardClip,
    //   to: '/user',
    // },
    {
      heading: 'Dashboard',
      icon: MdSpaceDashboard,
      to: `/user/userIdDashboard/${userId}/dashboard`,
    },
    // {
    //   heading: 'Business',
    //   icon: FaShop,
    //   to: `/user/userIdDashboard/${userId}/business`,
    // },
    {
      heading: 'Pool',
      icon: MdPool,
      to: `/user/userIdDashboard/${userId}/pool`,
    },
    {
      heading: 'Team',
      icon: FaArrowsDownToPeople,
      to: `/user/userIdDashboard/${userId}/teams`,
    },
    // {
    //   heading: 'Rewards',
    //   icon: GiReceiveMoney,
    //   to: `/user/userIdDashboard/${userId}/rewards`,
    // },
    {
      heading: 'Re-Entries',
      icon: GiEntryDoor,
      to: `/user/userIdDashboard/${userId}/re-entry`,
    },
    {
      heading: 'Transactions',
      icon: FaArrowRightArrowLeft,
      to: `/user/userIdDashboard/${userId}/transactions`,
    },
  ];

  return NavArray;
};
