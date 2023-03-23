import { NbMenuItem } from '@nebular/theme';

// home, authorization, documents_amendment, personal_documents, performance, ets1, sep, logout;
export let allowMenuByRole = {
  Admin: ['home', 'authorization', 'documents_amendment', 'personal_documents', 'performance', 'ets1', 'sep', 'logout'],
  Pilot: ['home', 'documents_amendment', 'personal_documents', 'performance', 'ets1', 'sep', 'logout'],
  Cabin_Crew: ['home', 'documents_amendment', 'personal_documents', 'sep', 'logout'],
  Flight_Operations: ['home', 'documents_amendment', 'personal_documents', 'logout'],
  Training: ['home', 'documents_amendment', 'personal_documents', 'ets1', 'logout'],
  Engineer:  ['home', 'documents_amendment', 'personal_documents', 'logout'],
}
export let menuListDetail = {
  home: { title: 'Home', icon: 'home-outline', link: '/pages/home', home: true,},
  authorization: { title: 'Authorization', icon: 'shield-outline', link: '/pages/authorization', },
  documents_amendment: { title: 'Documents Amendment', icon: 'flag-outline', link: '/pages/documents_amendment' },
  personal_documents: { title: 'Personal document(s)', icon: 'folder-outline', link: '/pages/personal_documents', },
  performance: { title: 'My performance', icon: 'trending-up', link: '/pages/performance', },
  ets1: {
    title: 'E-TS1',
    icon: 'file-outline',
    children: [
      {
        title: 'My dashboard (Moderator)',
        link: '/pages/ets1/mworkspace',
      },
      {
        title: 'My dashboard (Instructor)',
        link: '/pages/ets1/iworkspace',
      },
      {
        title: 'My E-TS1',
        link: '/pages/ets1/tworkspace',
      }
    ],
  },
  sep: { title: 'SEP Card', icon: 'book-outline', link: '/pages/sep', },
  logout: { title: 'Log out', icon: 'log-out', link: '/authentication/logout', },
}

// export let menuList = {
//   Pilot : [
//     {
//       title: 'Home',
//       icon: 'home-outline',
//       link: '/pages/home',
//       home: true,
//     },
//     {
//       title: 'Authorization',
//       icon: 'shield-outline',
//       link: '/pages/authorization',
//     },
//     {
//       title: 'Documents Amendment',
//       icon: 'flag-outline',
//       link: '/pages/documents_amendment'
//     },
//     {
//       title: 'Personal document(s)',
//       icon: 'folder-outline',
//       link: '/pages/personal_documents',
//     },
//     {
//       title: 'My performance',
//       icon: 'trending-up',
//       link: '/pages/performance',
//     },
//     {
//       title: 'E-TS1',
//       icon: 'file-outline',
//       children: [
//         {
//           title: 'My dashboard (Moderator)',
//           link: '/pages/ets1/mworkspace',
//         },
//         {
//           title: 'My dashboard (Instructor)',
//           link: '/pages/ets1/iworkspace',
//         },
//         {
//           title: 'My E-TS1',
//           link: '/pages/ets1/tworkspace',
//         }
//       ],
//     },
//     {
//       title: 'SEP Card',
//       icon: 'book-outline',
//       link: '/pages/sep',
//     },  
//     {
//       title: 'Log out',
//       icon: 'log-out',
//       link: '/authentication/logout',
//     },
//   ],

//   Cabin_Crew : [
//     {
//       title: 'Home',
//       icon: 'home',
//       link: '/pages/home',
//       home: true,
//     },
//     {
//       title: 'Documents Amendment',
//       icon: 'flag-outline',
//       link: '/pages/documents_amendment'
//     },
//     {
//       title: 'My document(s)',
//       icon: 'folder-outline',
//       link: '/pages/my_documents',
//       children: [
//         {
//           title: 'Dashboard (Moderator)',
//           link: '/pages/my_documents/moderator',
//         },
//         {
//           title: 'Dashboard',
//           link: '/pages/my_documents/dashboard',
//         }
//       ],
//     },
//     {
//       title: 'SEP Card',
//       icon: 'book-outline',
//       link: '/pages/sep',
//     },  
//     {
//       title: 'Log out',
//       icon: 'log-out',
//       link: '/authentication/logout',
//     },
//   ],

//   Flight_Operations : [
//     {
//       title: 'Home',
//       icon: 'home',
//       link: '/pages/home',
//       home: true,
//     },
//     {
//       title: 'Documents Amendment',
//       icon: 'flag-outline',
//       link: '/pages/documents_amendment'
//     },
//     {
//       title: 'My document(s)',
//       icon: 'folder-outline',
//       link: '/pages/my_documents',
//       children: [
//         {
//           title: 'Dashboard (Moderator)',
//           link: '/pages/my_documents/moderator',
//         },
//         {
//           title: 'Dashboard',
//           link: '/pages/my_documents/dashboard',
//         }
//       ],
//     },
//     {
//       title: 'Log out',
//       icon: 'log-out',
//       link: '/authentication/logout',
//     },
//   ],

//   Training : [
//     {
//       title: 'Home',
//       icon: 'home',
//       link: '/pages/home',
//       home: true,
//     },
//     {
//       title: 'Documents Amendment',
//       icon: 'flag-outline',
//       link: '/pages/documents_amendment'
//     },
//     {
//       title: 'My document(s)',
//       icon: 'folder-outline',
//       link: '/pages/my_documents',
//       children: [
//         {
//           title: 'Dashboard (Moderator)',
//           link: '/pages/my_documents/moderator',
//         },
//         {
//           title: 'Dashboard',
//           link: '/pages/my_documents/dashboard',
//         }
//       ],
//     },
//     {
//       title: 'E-TS1',
//       icon: 'file-outline',
//       children: [
//         {
//           title: 'My dashboard (Moderator)',
//           link: '/pages/ets1/mworkspace',
//         },
//         {
//           title: 'My dashboard (Instructor)',
//           link: '/pages/ets1/iworkspace',
//         },
//         {
//           title: 'My E-TS1',
//           link: '/pages/ets1/tworkspace',
//         }
//       ],
//     },
//     {
//       title: 'Log out',
//       icon: 'log-out',
//       link: '/authentication/logout',
//     },
//   ],

//   Engineer : [
//     {
//       title: 'Home',
//       icon: 'home',
//       link: '/pages/home',
//       home: true,
//     },
//     {
//       title: 'Documents Amendment',
//       icon: 'flag-outline',
//       link: '/pages/documents_amendment'
//     },
//     {
//       title: 'My document(s)',
//       icon: 'folder-outline',
//       link: '/pages/my_documents',
//       children: [
//         {
//           title: 'Dashboard (Moderator)',
//           link: '/pages/my_documents/moderator',
//         },
//         {
//           title: 'Dashboard',
//           link: '/pages/my_documents/dashboard',
//         }
//       ],
//     },  
//     {
//       title: 'Log out',
//       icon: 'log-out',
//       link: '/authentication/logout',
//     },
//   ]
// };

// export let MENU_ITEMS: NbMenuItem[] = [
//   {
//     title: 'Home',
//     icon: 'home',
//     link: '/pages/home',
//     home: true,
//   },
//   {
//     title: 'Performance',
//     icon: 'trending-up',
//     link: '/pages/performance',
//   },
//   {
//     title: 'SEP Card',
//     icon: 'book-outline',
//     link: '/pages/sep',
//   },  
//   /*
//     16 Mar 2023 wutthichair 
//       Inhibit this menu for production purpose.
//   */
//   // {
//   //   title: 'Forms',
//   //   icon: 'edit-2-outline',
//   //   children: [
//   //     {
//   //       title: 'Form Inputs',
//   //       link: '/pages/forms/inputs',
//   //     },
//   //     {
//   //       title: 'Form Layouts',
//   //       link: '/pages/forms/layouts',
//   //     },
//   //     {
//   //       title: 'Buttons',
//   //       link: '/pages/forms/buttons',
//   //     },
//   //     {
//   //       title: 'Datepicker',
//   //       link: '/pages/forms/datepicker',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'UI Features',
//   //   icon: 'keypad-outline',
//   //   link: '/pages/ui-features',
//   //   children: [
//   //     {
//   //       title: 'Grid',
//   //       link: '/pages/ui-features/grid',
//   //     },
//   //     {
//   //       title: 'Icons',
//   //       link: '/pages/ui-features/icons',
//   //     },
//   //     {
//   //       title: 'Typography',
//   //       link: '/pages/ui-features/typography',
//   //     },
//   //     {
//   //       title: 'Animated Searches',
//   //       link: '/pages/ui-features/search-fields',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Modal & Overlays',
//   //   icon: 'browser-outline',
//   //   children: [
//   //     {
//   //       title: 'Dialog',
//   //       link: '/pages/modal-overlays/dialog',
//   //     },
//   //     {
//   //       title: 'Window',
//   //       link: '/pages/modal-overlays/window',
//   //     },
//   //     {
//   //       title: 'Popover',
//   //       link: '/pages/modal-overlays/popover',
//   //     },
//   //     {
//   //       title: 'Toastr',
//   //       link: '/pages/modal-overlays/toastr',
//   //     },
//   //     {
//   //       title: 'Tooltip',
//   //       link: '/pages/modal-overlays/tooltip',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Extra Components',
//   //   icon: 'message-circle-outline',
//   //   children: [
//   //     {
//   //       title: 'Calendar',
//   //       link: '/pages/extra-components/calendar',
//   //     },
//   //     {
//   //       title: 'Progress Bar',
//   //       link: '/pages/extra-components/progress-bar',
//   //     },
//   //     {
//   //       title: 'Spinner',
//   //       link: '/pages/extra-components/spinner',
//   //     },
//   //     {
//   //       title: 'Alert',
//   //       link: '/pages/extra-components/alert',
//   //     },
//   //     {
//   //       title: 'Calendar Kit',
//   //       link: '/pages/extra-components/calendar-kit',
//   //     },
//   //     {
//   //       title: 'Chat',
//   //       link: '/pages/extra-components/chat',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Maps',
//   //   icon: 'map-outline',
//   //   children: [
//   //     {
//   //       title: 'Google Maps',
//   //       link: '/pages/maps/gmaps',
//   //     },
//   //     {
//   //       title: 'Leaflet Maps',
//   //       link: '/pages/maps/leaflet',
//   //     },
//   //     {
//   //       title: 'Bubble Maps',
//   //       link: '/pages/maps/bubble',
//   //     },
//   //     {
//   //       title: 'Search Maps',
//   //       link: '/pages/maps/searchmap',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Charts',
//   //   icon: 'pie-chart-outline',
//   //   children: [
//   //     {
//   //       title: 'Echarts',
//   //       link: '/pages/charts/echarts',
//   //     },
//   //     {
//   //       title: 'Charts.js',
//   //       link: '/pages/charts/chartjs',
//   //     },
//   //     {
//   //       title: 'D3',
//   //       link: '/pages/charts/d3',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Editors',
//   //   icon: 'text-outline',
//   //   children: [
//   //     {
//   //       title: 'TinyMCE',
//   //       link: '/pages/editors/tinymce',
//   //     },
//   //     {
//   //       title: 'CKEditor',
//   //       link: '/pages/editors/ckeditor',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Tables & Data',
//   //   icon: 'grid-outline',
//   //   children: [
//   //     {
//   //       title: 'Smart Table',
//   //       link: '/pages/tables/smart-table',
//   //     },
//   //     {
//   //       title: 'Tree Grid',
//   //       link: '/pages/tables/tree-grid',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Miscellaneous',
//   //   icon: 'shuffle-2-outline',
//   //   children: [
//   //     {
//   //       title: '404',
//   //       link: '/pages/miscellaneous/404',
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: 'Auth',
//   //   icon: 'lock-outline',
//   //   children: [
//   //     {
//   //       title: 'Login',
//   //       link: '/auth/login',
//   //     },
//   //     {
//   //       title: 'Register',
//   //       link: '/auth/register',
//   //     },
//   //     {
//   //       title: 'Request Password',
//   //       link: '/auth/request-password',
//   //     },
//   //     {
//   //       title: 'Reset Password',
//   //       link: '/auth/reset-password',
//   //     },
//   //   ],
//   // },
//   {
//     title: 'Log out',
//     icon: 'log-out',
//     link: '/authentication/logout',
//   },
// ];
