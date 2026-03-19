import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
    'dashboard.welcome': {
        id: 'dashboard.welcome',
        defaultMessage: 'Welcome back, {name}!',
        description: 'Greeting with user name',
    },
    'dashboard.inProgress': {
        id: 'dashboard.inProgress',
        defaultMessage: 'In Progress',
        description: 'Label for in-progress courses stat',
    },
    'dashboard.continueLearning': {
        id: 'dashboard.continueLearning',
        defaultMessage: 'Continue Learning',
        description: 'Section heading for continue learning courses',
    },
    'dashboard.myCourses': {
        id: 'dashboard.myCourses',
        defaultMessage: 'My Courses',
        description: 'Section heading for my courses',
    },
    'dashboard.wishlist': {
        id: 'dashboard.wishlist',
        defaultMessage: 'Wishlist',
        description: 'Tab title for wishlist',
    },
    'dashboard.completed': {
        id: 'dashboard.completed',
        defaultMessage: 'Completed',
        description: 'Tab title for completed courses',
    },
    'dashboard.achievements': {
        id: 'dashboard.achievements',
        defaultMessage: 'Achievements',
        description: 'Section heading for achievements/badges',
    },
    'dashboard.recommended': {
        id: 'dashboard.recommended',
        defaultMessage: 'Recommended for You',
        description: 'Section heading for recommended courses',
    },
    'dashboard.continue': {
        id: 'dashboard.continue',
        defaultMessage: 'Continue',
        description: 'Button to continue a course',
    },
    'dashboard.viewCourse': {
        id: 'dashboard.viewCourse',
        defaultMessage: 'View Course',
        description: 'Button to view course details',
    },
    'dashboard.viewProgress': {
        id: 'dashboard.viewProgress',
        defaultMessage: 'View Progress',
        description: 'Button in course card',
    },
    'dashboard.viewCertificate': {
        id: 'dashboard.viewCertificate',
        defaultMessage: 'View Certificate',
        description: 'Button for completed courses',
    },
    'dashboard.unenroll': {
        id: 'dashboard.unenroll',
        defaultMessage: 'Unenroll',
        description: 'Button to unenroll from course',
    },
    'dashboard.confirmUnenrollTitle': {
        id: 'dashboard.confirmUnenrollTitle',
        defaultMessage: 'Unenroll from course?',
        description: 'Unenroll confirmation dialog title',
    },
    'dashboard.confirmUnenrollDesc': {
        id: 'dashboard.confirmUnenrollDesc',
        defaultMessage: 'Are you sure you want to unenroll from "{title}"? Your progress will be lost.',
        description: 'Unenroll confirmation message',
    },
    'dashboard.cancel': {
        id: 'dashboard.cancel',
        defaultMessage: 'Cancel',
        description: 'Cancel button in dialog',
    },
    'dashboard.viewAll': {
        id: 'dashboard.viewAll',
        defaultMessage: 'View All',
        description: 'Link to view all achievements',
    },
    'dashboard.browseAll': {
        id: 'dashboard.browseAll',
        defaultMessage: 'Browse All',
        description: 'Link to browse all courses',
    },
    'dashboard.noWishlist': {
        id: 'dashboard.noWishlist',
        defaultMessage: 'No wishlisted courses',
        description: 'Message for empty wishlist',
    },
    'dashboard.error.fetch': {
        id: 'dashboard.error.fetch',
        defaultMessage: 'Failed to load courses',
        description: 'Error message for fetch failures',
    },
    'dashboard.noResults.title': {
        id: 'dashboard.noResults.title',
        defaultMessage: 'No results found',
        description: 'Title for no results state',
    },
});

export default messages;
