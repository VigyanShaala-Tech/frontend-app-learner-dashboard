import React from 'react';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
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
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import RestrictionPage from 'components/restriction-page/RestrictionPage';

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
  const [hasProfileCompleted, setHasProfileCompleted] = useState(true);
  const [canAccessPage, setCanaccessPage] = useState(true);
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
  useEffect(() => {
    const { LMS_BASE_URL } = getConfig();

    const loadProfileCompletion = async () => {
      try {
        const client = getAuthenticatedHttpClient();
        const { data } = await client.get(`${LMS_BASE_URL}/profile/progress/?role=student`);
        if (data?.percentage === 100) {
          setHasProfileCompleted(true);
        } else {
          setHasProfileCompleted(false);
        }
        setCanaccessPage(data.hidden);

      } catch (err) {
        console.error('Failed to load profile progress:', err);
        setHasProfileCompleted(false);
      }
    };

    loadProfileCompletion();
  }, []);
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
          {!hasProfileCompleted && !canAccessPage && <RestrictionPage />}
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
