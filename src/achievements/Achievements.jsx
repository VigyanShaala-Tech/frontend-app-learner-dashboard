import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Spinner } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faAward,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { fetchAchievementsAll } from '../custom-api/achievementsApi';

import messages from './custommessages';

import './Achievements.scss';
import AltBadgeImage from '../assets/image/badgealt.jpeg';
import PlaceholderImage from '../assets/image/placeholder-image.jpeg';

const Achievements = () => {
  const { formatMessage } = useIntl();
  const { authenticatedUser } = useContext(AppContext);
  const location = useLocation();

  const [summaryCards, setSummaryCards] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [progressBadges, setProgressBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);


  const baseUrl = getConfig().LMS_BASE_URL;
  const httpClient = getAuthenticatedHttpClient();

  const mapStats = (stats = []) => stats.map((item) => ({
    ...item,
    icon:
      item.icon === 'faAward'
        ? faAward
        : item.icon === 'faTrophy'
          ? faTrophy
          : faCheckCircle,
  }));

  useEffect(() => {
    const initialData = location?.state?.achievementsData;

    if (initialData) {
      setSummaryCards(mapStats(initialData.stats || []));
      setEarnedBadges(initialData.earned_badges || []);
      setProgressBadges(initialData.badges_in_progress || []);
      setLoading(false);
      return;
    }

    const loadAchievements = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await fetchAchievementsAll({ httpClient, baseUrl });
        setSummaryCards(mapStats(data.stats || []));
        setEarnedBadges(data.earned_badges || []);
        setProgressBadges(data.badges_in_progress || []);
      } catch (err) {
        console.error('Failed to fetch summary cards:', err);
        setSummaryCards([]);
        setEarnedBadges([]);
        setProgressBadges([]);
        setLoadError(formatMessage(messages['achievement.error.fetch']));
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [baseUrl, location?.state?.achievementsData]);

  return (
    <div className="achievement-page mt-3">
      <div className="container">
        <h1 className="achievement-title">
          {formatMessage(messages['achievement.welcome'])}
        </h1>
      </div>

      {loading && (
        <div className="container d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && loadError && (
        <div className="container">
          <Alert variant="danger">{loadError}</Alert>
        </div>
      )}

      {!loading && summaryCards.length > 0 && (
        <div className="container stats">
          <div className="row">
            {summaryCards.map((data) => (
              <div
                key={data.id}
                className="col-12 col-sm-6 col-lg-4 mb-4"
              >
                <div className="card d-flex flex-row p-4 align-items-center achievement-stat">
                  <FontAwesomeIcon
                    icon={data.icon}
                    size="2x"
                    className="text-primary mb-2"
                  />
                  <p className="text-muted state-name ml-3">{data.label}</p>
                  <h3 className="stat-number ml-auto">{data.number}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && earnedBadges.length > 0 && (
        <div className="container">
          <h2 className="mb-4 dashboard-section-title">
            {formatMessage(messages['achievement.badgesEarned'])}
          </h2>
          <div className="row">
            {earnedBadges.map((data) => (
              <div
                key={data.id}
                className="col-12 col-sm-6 col-lg-4 mb-4"
              >
                <div className="card p-4 d-flex align-items-center achievement-stat">
                  <img src={data.icon_url || AltBadgeImage } alt={data.title} className="mb-3 badge-img" 
                    onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PlaceholderImage;}}
                  />
                  <h3 className="stat-title mb-1">{data.title}</h3>
                  <p className="text-muted state-name">{data.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && progressBadges.length > 0 && (
        <div className="container">
          <h2 className="mb-4 dashboard-section-title">
            {formatMessage(messages['achievement.inProgress'])}
          </h2>
          <div className="row">
            {progressBadges.map((data) => (
              <div
                key={data.id}
                className="col-12 col-sm-6 col-lg-4 mb-4"
              >
                <div className="card p-4 d-flex align-items-center achievement-stat inactive">
                  <img src={data.icon_url || AltBadgeImage } alt={data.title} className="mb-3 badge-img" 
                    onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PlaceholderImage;}}
                  />
                  <h3 className="stat-title mb-1">{data.title}</h3>
                  <p className="text-muted state-name">{data.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Achievements;