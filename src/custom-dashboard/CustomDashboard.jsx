import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Alert, Tabs, Tab, ProgressBar, Spinner, Pagination } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faCheckCircle,
  faChartLine,
  faAward,
  faHeart,
  faChevronRight,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import messages from './custommessages';
import { fetchRecommendedCourses } from '../custom-api/recommendedCoursesApi';
import { fetchAchievementsAll } from '../custom-api/achievementsApi';
import { fetchNotifications, checkoutNotifications } from '../custom-api/notificationsApi';
import { checkPhoneStatus } from '../custom-api/phoneStatusApi';
import WhatsAppVerificationModal from './components/WhatsAppVerificationModal';

import './CustomDashboard.scss';
import CourseCard from './custom-component/CourseCard/CourseCard';
import AltBadgeImage from '../assets/image/badgealt.jpeg';

const Dashboard = () => {
  const { formatMessage } = useIntl();
  const { authenticatedUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('in-progress');
  // const [unenrollCourse, setUnenrollCourse] = useState(null);

  // Data states
  const [summaryCards, setSummaryCards] = useState([]);
  const [continueLearningCourses, setContinueLearningCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // Tab-specific states
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [inProgressCurrentPage, setInProgressCurrentPage] = useState(1);
  const [inProgressTotalPages, setInProgressTotalPages] = useState(1);
  const [inProgressLoading, setInProgressLoading] = useState(true);
  const [inProgressError, setInProgressError] = useState(null);

  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [wishlistCurrentPage, setWishlistCurrentPage] = useState(1);
  const [wishlistTotalPages, setWishlistTotalPages] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  const [completedCourses, setCompletedCourses] = useState([]);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
  const [completedTotalPages, setCompletedTotalPages] = useState(1);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [completedError, setCompletedError] = useState(null);
  const [achievementsRedirectLoading, setAchievementsRedirectLoading] = useState(false);
  const [notificationState, setNotificationState] = useState({
    haveNewNotification: false,
    notifications: [],
  });
  const [showNotifications, setShowNotifications] = useState(false);

  // WhatsApp phone verification modal
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const { config } = useContext(AppContext);
  const learningBaseUrl = config.LEARNING_BASE_URL;
  const publicBaseUrl = config.CATALOG_MICROFRONTEND_URL;

  // Refs
  const myCoursesRef = useRef(null);
  const achievementsRef = useRef(null);
  const notificationRef = useRef(null);

  const baseUrl = getConfig().LMS_BASE_URL;
  const httpClient = getAuthenticatedHttpClient();

  const loadNotifications = useCallback(async () => {
    try {
      const data = await fetchNotifications({ httpClient, baseUrl });
      setNotificationState(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotificationState({
        haveNewNotification: false,
        notifications: [],
      });
    }
  }, [baseUrl]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Check phone number on mount; show verification modal if missing and not skipped in this session
  useEffect(() => {
    const SKIP_KEY = 'vs_whatsapp_modal_skipped';
    if (sessionStorage.getItem(SKIP_KEY)) {
      return;
    }
    checkPhoneStatus({ httpClient, baseUrl }).then(({ hasPhoneNumber }) => {
      if (!hasPhoneNumber) {
        setShowPhoneModal(true);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNotificationClick = async () => {
    setShowNotifications((prev) => !prev);

    if (!notificationState.haveNewNotification) {
      return;
    }

    try {
      const success = await checkoutNotifications({ httpClient, baseUrl });
      if (success) {
        await loadNotifications();
      }
    } catch (err) {
      console.error('Failed to checkout notifications:', err);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch summary cards
  useEffect(() => {
    const fetchSummaryCards = async () => {
      try {
        const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/summary-cards/`);
        if (res.status === 200 && res.data) {
          const mappedCards = res.data.map((item) => ({
            ...item,
            icon: item.icon === 'faBookOpen' ? faBookOpen : item.icon === 'faCheckCircle' ? faCheckCircle : item.icon === 'faChartLine' ? faChartLine : faAward,
            type: item.label,
          }));
          setSummaryCards(mappedCards);
        }
      } catch (err) {
        console.error('Failed to fetch summary cards:', err);
        setSummaryCards([]);
      }
    };
    fetchSummaryCards();
  }, [baseUrl]);

  // Fetch continue learning
  useEffect(() => {
    const fetchContinueLearning = async () => {
      try {
        const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/continue-learning/`);
        if (res.status === 200 && res.data) {
          const mappedCourses = res.data.map((item) => ({
            id: item.id,
            title: item.title,
            image: item.course_image,
            progress: item.progress,
            category: item.category,
            level: item.level,
          }));
          setContinueLearningCourses(mappedCourses);
        }
      } catch (err) {
        console.error('Failed to fetch continue learning:', err);
        setContinueLearningCourses([]);
      }
    };
    fetchContinueLearning();
  }, [baseUrl]);

  // Fetch achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/achievements/`);
        if (res.status === 200 && res.data) {
          setAchievements(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
        setAchievements([]);
      }
    };
    fetchAchievements();
  }, [baseUrl]);

  // Fetch recommended
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const data = await fetchRecommendedCourses({ httpClient, baseUrl });
        setRecommendedCourses(data);
      } catch (err) {
        console.error('Failed to fetch recommended courses:', err);
        setRecommendedCourses([]);
      }
    };
    loadRecommended();
  }, [baseUrl]);

  // Fetch in-progress courses
  const fetchInProgressCourses = useCallback(async (page = 1) => {
    setInProgressLoading(true);
    setInProgressError(null);
    try {
      const params = new URLSearchParams();
      if (page > 1) params.append('page', page);
      const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/in-progress-courses/?${params.toString()}`);
      if (res.status === 200 && res.data?.results) {
        const mappedCourses = res.data.results.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.course_image,
          progress: item.progress,
          category: item.category,
          level: item.level,
        }));
        setInProgressCourses(mappedCourses);
        setInProgressTotalPages(res.data.pagination?.num_pages || 1);
      } else {
        setInProgressCourses([]);
        setInProgressTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch in-progress courses:', err);
      setInProgressError(formatMessage(messages['dashboard.error.fetch']));
      setInProgressCourses([]);
      setInProgressTotalPages(1);
    } finally {
      setInProgressLoading(false);
    }
  }, [baseUrl, formatMessage]);

  useEffect(() => {
    fetchInProgressCourses(1);
  }, [fetchInProgressCourses]);

  // Fetch wishlist
  const fetchWishlistCourses = useCallback(async (page = 1) => {
    setWishlistLoading(true);
    setWishlistError(null);
    try {
      const params = new URLSearchParams();
      if (page > 1) params.append('page', page);
      const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/wishlist/?${params.toString()}`);
      if (res.status === 200 && res.data?.results) {
        setWishlistCourses(res.data.results);
        setWishlistTotalPages(res.data.pagination?.num_pages || 1);
      } else {
        setWishlistCourses([]);
        setWishlistTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist courses:', err);
      setWishlistError(formatMessage(messages['dashboard.error.fetch']));
      setWishlistCourses([]);
      setWishlistTotalPages(1);
    } finally {
      setWishlistLoading(false);
    }
  }, [baseUrl, formatMessage]);

  // Fetch completed
  const fetchCompletedCourses = useCallback(async (page = 1) => {
    setCompletedLoading(true);
    setCompletedError(null);
    try {
      const params = new URLSearchParams();
      if (page > 1) params.append('page', page);
      const res = await httpClient.get(`${baseUrl}/api/v1/dashboard/completed-courses/?${params.toString()}`);
      if (res.status === 200 && res.data?.results) {
        const mappedCourses = res.data.results.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.course_image,
          progress: 100,
          category: item.category,
          level: item.level,
          status: 'completed',
          certificate_url: item.certificate_url,
        }));
        setCompletedCourses(mappedCourses);
        setCompletedTotalPages(res.data.pagination?.num_pages || 1);
      } else {
        setCompletedCourses([]);
        setCompletedTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch completed courses:', err);
      setCompletedError(formatMessage(messages['dashboard.error.fetch']));
      setCompletedCourses([]);
      setCompletedTotalPages(1);
    } finally {
      setCompletedLoading(false);
    }
  }, [baseUrl, formatMessage]);

  // Tab change handler
  useEffect(() => {
    if (activeTab === 'in-progress') {
      fetchInProgressCourses(inProgressCurrentPage);
    } else if (activeTab === 'wishlist') {
      fetchWishlistCourses(wishlistCurrentPage);
    } else if (activeTab === 'completed') {
      fetchCompletedCourses(completedCurrentPage);
    }
  }, [activeTab]);

  // Reset page on tab change
  useEffect(() => {
    if (activeTab === 'in-progress') setInProgressCurrentPage(1);
    if (activeTab === 'wishlist') setWishlistCurrentPage(1);
    if (activeTab === 'completed') setCompletedCurrentPage(1);
  }, [activeTab]);

  const handleStatClick = (id) => {
    if (id === 3) {
      setActiveTab('in-progress');
      myCoursesRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 2) {
      setActiveTab('completed');
      myCoursesRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 1) {
      setActiveTab('in-progress');
      myCoursesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }else if (id === 4) {
      achievementsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

  };

  const handleContinueLearningButton = (course) => {
    const learningUrl = `${learningBaseUrl}/course/${course.id}`;
    window.location.href = learningUrl;
  }
  const handleViewProgressButton = (course) => {
    const progressUrl = `${learningBaseUrl}/course/${course.id}/progress`;
    window.location.href = progressUrl;
  }
  const handleViewCourse = (course) => {
    const viewCourseUrl = `${publicBaseUrl}courses/${course.id}`;
    window.location.href = viewCourseUrl;
  }
  const handleViewCertificate = (course) => {
    const certificateUrl = course.certificate_url;
    console.warn(certificateUrl);
    window.location.href = certificateUrl;
  }

  const handleRemoveWishlist = async (course) => {
    try {
      const response = await httpClient.post(
        `${baseUrl}/api/v1/wishlist/remove/`,
        { course_id: course.id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200 ) {
        await fetchWishlistCourses(wishlistCurrentPage);
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      await fetchWishlistCourses(wishlistCurrentPage);
    } finally {
      await fetchWishlistCourses(wishlistCurrentPage);
    }
  };

  const handlePageChange = (page, tab) => {
    if (tab === 'in-progress') {
      setInProgressCurrentPage(page);
      fetchInProgressCourses(page);
    } else if (tab === 'wishlist') {
      setWishlistCurrentPage(page);
      fetchWishlistCourses(page);
    } else if (tab === 'completed') {
      setCompletedCurrentPage(page);
      fetchCompletedCourses(page);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistCourses(prev => prev.filter(c => c.id !== id));
  };

  const handlePhoneModalClose = useCallback(() => {
    sessionStorage.setItem('vs_whatsapp_modal_skipped', '1');
    setShowPhoneModal(false);
  }, []);

  const handlePhoneModalSuccess = useCallback(() => {
    setShowPhoneModal(false);
  }, []);

  const handleViewAllAchievements = async () => {
    try {
      setAchievementsRedirectLoading(true);
      const data = await fetchAchievementsAll({ httpClient, baseUrl });
      navigate('/achievements', { state: { achievementsData: data } });
    } catch (err) {
      console.error('Failed to prefetch achievements:', err);
    } finally {
      setAchievementsRedirectLoading(false);
    }
  };

  const renderTabContent = (tabKey) => {
    if (tabKey === 'in-progress') {
      if (inProgressLoading) {
        return (
          <div className="d-flex justify-content-center align-items-center py-8">
            <Spinner animation="border" variant="primary" />
          </div>
        );
      }
      if (inProgressError) {
        return <Alert variant="danger">{inProgressError}</Alert>;
      }
      if (inProgressCourses.length === 0) {
        return (
          <div className="text-center py-8 no-results rounded">
            <p className="text-muted mb-0">
              {formatMessage(messages['dashboard.noInProgress'])}
            </p>
          </div>
        );
      }
      return (
        <>
          <div className="row my-courses-grid">
            {inProgressCourses.map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-3 mb-4">
                <CourseCard course={course} progresscard={true} buttonName={formatMessage(messages['dashboard.viewProgress'])} handleButtonClick={() => handleViewProgressButton(course)} />
              </div>
            ))}
          </div>
          {inProgressTotalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                paginationLabel={formatMessage(messages['dashboard.pagination.inProgress'])}
                pageCount={inProgressTotalPages}
                currentPage={inProgressCurrentPage}
                onPageSelect={(page) => handlePageChange(page, 'in-progress')}
                variant="primary"
              />
            </div>
          )}
        </>
      );
    }

    if (tabKey === 'wishlist') {
      if (wishlistLoading) {
        return (
          <div className="d-flex justify-content-center align-items-center py-8">
            <Spinner animation="border" variant="primary" />
          </div>
        );
      }
      if (wishlistError) {
        return <Alert variant="danger">{wishlistError}</Alert>;
      }
      if (wishlistCourses.length === 0) {
        return (
          <div className="col-12 text-center py-5 text-muted">
            <FontAwesomeIcon icon={faHeart} size="3x" className="mb-3" />
            <p>{formatMessage(messages['dashboard.noWishlist'])}</p>
          </div>
        );
      }
      return (
        <>
          <div className="row my-courses-grid">
            {wishlistCourses.map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-3 mb-4">
                <CourseCard
                  course={course}
                  buttonName={formatMessage(messages['dashboard.viewCourse'])}
                  handleButtonClick={() => handleViewCourse(course)}
                  handleRemove={() => handleRemoveWishlist(course)}
                />
              </div>
            ))}
          </div>
          {wishlistTotalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                paginationLabel={formatMessage(messages['dashboard.pagination.wishlist'])}
                pageCount={wishlistTotalPages}
                currentPage={wishlistCurrentPage}
                onPageSelect={(page) => handlePageChange(page, 'wishlist')}
                variant="primary"
              />
            </div>
          )}
        </>
      );
    }

    if (tabKey === 'completed') {
      if (completedLoading) {
        return (
          <div className="d-flex justify-content-center align-items-center py-8">
            <Spinner animation="border" variant="primary" />
          </div>
        );
      }
      if (completedError) {
        return <Alert variant="danger">{completedError}</Alert>;
      }
      if (completedCourses.length === 0) {
        return (
          <div className="text-center py-8 no-results rounded">
            <p className="text-muted mb-0">
              {formatMessage(messages['dashboard.noCompleted'])}
            </p>
          </div>
        );
      }
      return (
        <>
          <div className="row my-courses-grid">
            {completedCourses.map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-3 mb-4">
                <CourseCard course={course} progresscard={true} buttonName={formatMessage(messages['dashboard.viewCertificate'])} handleButtonClick={() => handleViewCertificate(course)} />
              </div>
            ))}
          </div>
          {completedTotalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                paginationLabel={formatMessage(messages['dashboard.pagination.completed'])}
                pageCount={completedTotalPages}
                currentPage={completedCurrentPage}
                onPageSelect={(page) => handlePageChange(page, 'completed')}
                variant="primary"
              />
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="dashboard-page mt-3">
      {/* Banner / Hero */}
      <div className="container dashboard-hero-header">
        <h1 className="dashboard-title mb-0">
          {formatMessage(messages['dashboard.welcome'], { name: authenticatedUser.name })}
        </h1>
        <div className="notification-wrapper" ref={notificationRef}>
          <button
            type="button"
            className="notification-trigger"
            aria-label={formatMessage(messages['dashboard.notifications.ariaLabel'])}
            onClick={handleNotificationClick}
          >
            <FontAwesomeIcon icon={faBell} />
            {notificationState.haveNewNotification && (
              <span className="notification-dot" />
            )}
          </button>
          {showNotifications && (
            <div className="notification-panel">
              {notificationState.notifications.length > 0 ? (
                notificationState.notifications.map((item) => (
                  <div key={item.id} className="notification-item">
                    <h6>{item.title}</h6>
                    <p>{item.description}</p>
                  </div>
                ))
              ) : (
                <div className="notification-empty">
                  {formatMessage(messages['dashboard.notifications.empty'])}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {summaryCards.length > 0 && (
        <div className="container stats">
          <div className="row">
            {summaryCards.map((data) => (
              <div key={data.id} className="col-6 col-md-3 mb-4">
                <div
                  className="card p-3 text-start dashboard-stat"
                  onClick={() => handleStatClick(data.id)}
                >
                  <FontAwesomeIcon icon={data.icon} size="2x" className="text-primary mb-2" />
                  <h3 className="stat-number">{data.number}</h3>
                  <p className="text-muted state-name">{data.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Learning */}
      {continueLearningCourses.length > 0 && (
        <div className="container dashboard-continue-learning">
          <h2 className="mb-4 dashboard-section-title">
            {formatMessage(messages['dashboard.continueLearning'])}
          </h2>
          <div className="row">
            {continueLearningCourses.map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-4 mb-4">
                <CourseCard course={course} progresscard={true} buttonName={formatMessage(course.progress > 0 ? messages['dashboard.continue'] : messages['dashboard.start'])} handleButtonClick={() => handleContinueLearningButton(course)}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Courses */}
      <div className="container dashboard-my-courses" ref={myCoursesRef}>
        <h2 className="mb-4 dashboard-section-title">
          {formatMessage(messages['dashboard.myCourses'])}
        </h2>

        <Tabs
          id="my-courses-tabs"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-4 custom-tabs"
        >
          <Tab eventKey="in-progress" title={formatMessage(messages['dashboard.inProgress'])}>
            {renderTabContent('in-progress')}
          </Tab>

          <Tab eventKey="wishlist" title={formatMessage(messages['dashboard.wishlist'])}>
            {renderTabContent('wishlist')}
          </Tab>

          <Tab eventKey="completed" title={formatMessage(messages['dashboard.completed'])}>
            {renderTabContent('completed')}
          </Tab>
        </Tabs>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="container dashboard-achievements-section" ref={achievementsRef}>
          <h2 className="mb-4 dashboard-section-title">
            {formatMessage(messages['dashboard.achievements'])}
          </h2>
          <div className="card p-3">
            <div className="row border-bottom mb-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="col-6 col-sm-6 col-md-3 col-lg-3 mb-4 text-center">
                  <div className="p-3 bg-white">
                    <img src={ach.img || AltBadgeImage } alt={ach.title} className="badge-img"
                      onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PlaceholderImage;}}
                    />
                    <p className="small achievement-badge-title">{ach.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right">
              <Button
                variant="link"
                className="text-primary"
                onClick={handleViewAllAchievements}
                disabled={achievementsRedirectLoading}
              >
                {achievementsRedirectLoading ? (
                  <Spinner animation="border" size="sm" className="mr-2" />
                ) : null}
                {formatMessage(messages['dashboard.viewAll'])}
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended */}
      {recommendedCourses.length > 0 && (
        <div className="container mt-4 dashboard-recommended-section">
          <div className="d-flex justify-content-between mb-3">
            <h2 className="dashboard-section-title">
              {formatMessage(messages['dashboard.recommended'])}
            </h2>
            <Link to={`${publicBaseUrl}courses`}>
              <Button variant="link" className="text-primary">
                {formatMessage(messages['dashboard.browseAll'])} <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="row">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-4 mb-4">
                <CourseCard course={course} buttonName={formatMessage(messages['dashboard.viewCourse'])} handleButtonClick={() => handleViewCourse(course)}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp number verification modal */}
      <WhatsAppVerificationModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onSuccess={handlePhoneModalSuccess}
      />

      {/* {unenrollCourse && (
        <Alert
          variant="danger"
          className="fixed-bottom m-4 p-4 rounded"
          dismissible
          onClose={() => setUnenrollCourse(null)}
        >
          <h4>{formatMessage(messages['dashboard.confirmUnenrollTitle'])}</h4>
          <p>
            {formatMessage(messages['dashboard.confirmUnenrollDesc'], { title: unenrollCourse.title })}
          </p>
          <Button variant="secondary" className="me-3" onClick={() => setUnenrollCourse(null)}>
            {formatMessage(messages['dashboard.cancel'])}
          </Button>
          <Button variant="danger" onClick={() => setUnenrollCourse(null)}>
            {formatMessage(messages['dashboard.unenroll'])}
          </Button>
        </Alert>
      )} */}
    </div>
  );
};

export default Dashboard;