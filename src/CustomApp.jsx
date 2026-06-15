import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import { FooterSlot } from '@edx/frontend-component-footer';
import { Alert } from '@openedx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from './custom-dashboard/CustomDashboard';
import Achievements from './achievements/Achievements';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import AppWrapper from 'containers/AppWrapper';
import CustomLearnerDashboardHeader from 'containers/CustomLearnerDashboardHeader';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import './App.scss';
import './custom-styles/index.scss';

const CUSTOM_PAGE_SCROLL_CLASS = 'custom-page-scroll';

export const CustomApp = ({ variant = 'dashboard' }) => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { formatMessage } = useIntl();
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  React.useEffect(() => {
    document.documentElement.classList.add(CUSTOM_PAGE_SCROLL_CLASS);
    document.body.classList.add(CUSTOM_PAGE_SCROLL_CLASS);

    return () => {
      document.documentElement.classList.remove(CUSTOM_PAGE_SCROLL_CLASS);
      document.body.classList.remove(CUSTOM_PAGE_SCROLL_CLASS);
    };
  }, []);

  React.useEffect(() => {
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }
    if (getConfig().HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: getConfig().HOTJAR_APP_ID,
          hotjarVersion: getConfig().HOTJAR_VERSION,
          hotjarDebug: !!getConfig().HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }
  }, [authenticatedUser, loadData]);
  return (
    <>
      <Helmet>
        <title>{variant === 'achievements'
            ? formatMessage(messages.achievementsPageTitle)
            : formatMessage(messages.pageTitle)}</title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div>
        <AppWrapper>
          <CustomLearnerDashboardHeader />
          <main id="main">
            {hasNetworkFailure
              ? (
                <Alert variant="danger">
                  <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
                </Alert>
              ) : variant === 'achievements' ? (
                <Achievements/>
              ) : (
                <Dashboard />
              )}
          </main>
        </AppWrapper>
        <FooterSlot />
      </div>
    </>
  );
};

export default CustomApp;
