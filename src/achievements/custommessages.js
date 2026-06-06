import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'achievement.title': {
    id: 'achievement.title',
    defaultMessage: 'Learner Achievements',
    description: 'Main page title for achievements page',
  },
  'achievement.welcome': {
    id: 'achievement.welcome',
    defaultMessage: 'My Achievements',
    description: 'Greeting with user name',
  },
  'achievement.badgesEarned': {
    id: 'achievement.badgesEarned',
    defaultMessage: 'Earned Badges',
  },
  'achievement.inProgress': {
    id: 'achievement.inProgress',
    defaultMessage: 'Badges in Progress',
  },
  'achievement.error.fetch': {
    id: 'achievement.error.fetch',
    defaultMessage: 'Failed to load achievements',
    description: 'Error message when achievements API call fails',
  },
});

export default messages;