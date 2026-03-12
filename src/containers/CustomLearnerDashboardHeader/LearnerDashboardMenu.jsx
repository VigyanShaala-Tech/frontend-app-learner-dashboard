import { getConfig } from '@edx/frontend-platform';

import urls from 'data/services/lms/urls';

import messages from './messages';

const getLearnerHeaderMenu = (
  formatMessage,
  courseSearchUrl,
  authenticatedUser,
  exploreCoursesClick,
) => ({
  mainMenu: [
    {
      type: 'item',
      href: '/learner-dashboard/',
      content: formatMessage(messages.course),
      isActive: true,
    },
    {
      type: 'item',
      href: `${getConfig().CATALOG_MICROFRONTEND_URL}courses`,
      content: formatMessage(messages.discoverNew),
    }
  ],
  secondaryMenu: [
    ...(getConfig().SUPPORT_URL ? [{
      type: 'item',
      href: `${getConfig().SUPPORT_URL}`,
      content: formatMessage(messages.help),
    }] : []),
  ],
  userMenu: [
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_PROFILE_URL}/u/${authenticatedUser?.username}`,
          content: formatMessage(messages.profile),
        },
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_SETTINGS_URL}`,
          content: formatMessage(messages.account),
        },
        ...(getConfig().ORDER_HISTORY_URL ? [{
          type: 'item',
          href: getConfig().ORDER_HISTORY_URL,
          content: formatMessage(messages.orderHistory),
        }] : []),
      ],
    },
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: `${getConfig().LOGOUT_URL}`,
          content: formatMessage(messages.signOut),
        },
      ],
    },
  ],
}
);

export default getLearnerHeaderMenu;
