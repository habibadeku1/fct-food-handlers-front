import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_ADMIN: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/main-pages/main-dashboard',
    home: true,
  },
  {
    title: 'Profiles',
    icon: 'nb-person',
    // link: '/main-pages/orders',
    // home: true,
    children: [
      {
        title: 'Food Handlers',
        link: '/main-pages/profiles',
      },
      // {
      //   title: 'Create Profile',
      //   link: '/main-pages/create-profile',
      // },
    ]
  },
  {
    title: 'Employers',
    icon: 'nb-compose',
    children: [
      {
        title: 'Employers List',
        link: '/main-pages/employers',
      },
      {
        title: 'Add Employer',
        link: '/main-pages/create-employer',
      },
    ]
  },
  {
    title: 'Tests',
    icon: 'nb-list',
    children: [
      {
        title: 'Tests List',
        link: '/main-pages/lab-tests',
      }      
    ]
  },
  {
    title: 'General Settings',
    icon: 'nb-keypad',
    link: ''
  },
];

export const MENU_ITEMS_FIELD_OP: NbMenuItem[] = [
  {
    title: 'Profiles',
    icon: 'nb-person',
    // link: '/main-pages/orders',
    // home: true,
    children: [
      {
        title: 'Food Handlers',
        link: '/main-pages/profiles',
      },
      {
        title: 'Create Profile',
        link: '/main-pages/create-profile',
      },
    ]
  },
  {
    title: 'Employers',
    icon: 'nb-compose',
    children: [
      {
        title: 'Employers List',
        link: '/main-pages/employers',
      },
      {
        title: 'Add Employer',
        link: '/main-pages/create-employer',
      },
    ]
  },
];

export const MENU_ITEMS_LAB_OP: NbMenuItem[] = [
  {
    title: 'Profiles',
    icon: 'nb-person',
    // link: '/main-pages/orders',
    // home: true,
    children: [
      {
        title: 'Food Handlers',
        link: '/main-pages/profiles',
      },
      // {
      //   title: 'Create Profile',
      //   link: '/main-pages/create-profile',
      // },
    ]
  }
];

export const MENU_ITEMS_SUPER_ADMIN: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    // link: '/main-pages/main-dashboard',
    home: true,
  },
  {
    title: 'Profiles',
    icon: 'nb-person',
    // link: '/main-pages/orders',
    // home: true,
    children: [
      {
        title: 'Food Handlers',
        link: '/main-pages/profiles',
      },
      {
        title: 'Create Profile',
        link: '/main-pages/create-profile',
      },
    ]
  },
  {
    title: 'Employers',
    icon: 'nb-compose',
    children: [
      {
        title: 'Employers List',
        link: '/main-pages/employers',
      },
      {
        title: 'Add Employer',
        link: '/main-pages/create-employer',
      },
    ]
  },
  {
    title: 'Tests',
    icon: 'nb-list',
    children: [
      {
        title: 'Tests List',
        link: '',
      },
      {
        title: 'Add Test Type',
        link: '',
      },
    ]
  }
];
