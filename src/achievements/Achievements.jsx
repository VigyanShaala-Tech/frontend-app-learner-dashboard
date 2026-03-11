import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faCheckCircle,
  faChartLine,
  faAward,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import messages from './custommessages';

import './Achievements.scss';
import AltBadgeImage from '../assets/image/badgealt.jpeg';

const Achievements = () => {
  const { formatMessage } = useIntl();
  const { authenticatedUser } = useContext(AppContext);

  const [summaryCards, setSummaryCards] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [progressBadges, setProgressBadges] = useState([]);


  const baseUrl = getConfig().LMS_BASE_URL;
  const httpClient = getAuthenticatedHttpClient();

  useEffect(() => {
    const fetchSummaryCards = async () => {
      try {
        const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/summary-cards/`);

        if (res.status === 200 && res.data) {
          const mappedCards = res.data.map((item) => ({
            ...item,
            icon:
              item.icon === 'faBookOpen'
                ? faBookOpen
                : item.icon === 'faCheckCircle'
                ? faCheckCircle
                : item.icon === 'faChartLine'
                ? faChartLine
                : faAward,
          }));

          setSummaryCards(mappedCards);
        }
      } catch (err) {
        console.error('Failed to fetch summary cards:', err);
        setSummaryCards([]);
      }
    };


    const fetchEarnedBadges = async () => {
      try {
        const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/summary-cards/`);

        if (res.status === 200 && res.data) {
          const mappedCards = res.data.map((item) => ({
            ...item,
            icon:
              item.icon === 'faBookOpen'
                ? faBookOpen
                : item.icon === 'faCheckCircle'
                ? faCheckCircle
                : item.icon === 'faChartLine'
                ? faChartLine
                : faAward,
          }));

          setEarnedBadges(mappedCards);
        }
      } catch (err) {
        console.error('Failed to fetch summary cards:', err);
        setSummaryCards([]);
      }
    };

    const fetchProgressBadges = async () => {
      try {
        const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/summary-cards/`);

        if (res.status === 200 && res.data) {
          const mappedCards = res.data.map((item) => ({
            ...item,
            icon:
              item.icon === 'faBookOpen'
                ? faBookOpen
                : item.icon === 'faCheckCircle'
                ? faCheckCircle
                : item.icon === 'faChartLine'
                ? faChartLine
                : faAward,
          }));

          setProgressBadges(mappedCards);
        }
      } catch (err) {
        console.error('Failed to fetch summary cards:', err);
        setSummaryCards([]);
      }
    };

    fetchSummaryCards();
    fetchEarnedBadges();
    fetchProgressBadges();
  }, [baseUrl]);

  return (
    <div className="achievement-page mt-3">
      <div className="container">
        <h1 className="achievement-title">
          {formatMessage(messages['achievement.welcome'])}
        </h1>
      </div>

      {summaryCards.length > 0 && (
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

      {earnedBadges.length > 0 && (
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
                  <img src={data.img || AltBadgeImage } alt={data.label} className="mb-3 badge-img" 
                    onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PlaceholderImage;}}
                  />
                  <h3 className="stat-title mb-1">{data.number}</h3>
                  <p className="text-muted state-name">{data.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {progressBadges.length > 0 && (
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
                  <img src={data.img || AltBadgeImage } alt={data.label} className="mb-3 badge-img" 
                    onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PlaceholderImage;}}
                  />
                  <h3 className="stat-title mb-1">{data.number}</h3>
                  <p className="text-muted state-name">{data.label}</p>
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