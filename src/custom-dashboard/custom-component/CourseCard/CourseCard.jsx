import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, ProgressBar } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faChartLine,
  faStar,
  faUser,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import messages from '../../custommessages';
import './CourseCard.scss';
import PlaceholderImage from '../../../assets/image/placeholder-image.jpeg';

const CourseCard = ({ course, progresscard = false, buttonName = '', handleButtonClick = null, handleRemove = null }) => {
  const { formatMessage } = useIntl();
  const hasDisplayValue = (value) => value !== null && value !== undefined && value !== '' && value !== 0;
  const showMeta = hasDisplayValue(course.duration) || hasDisplayValue(course.level);
  const showRating = hasDisplayValue(course.rating) && hasDisplayValue(course.reviews);
  const showInstructor = hasDisplayValue(course.instructor);

  const handlePrimaryAction = (e) => {
    if (handleButtonClick) {
      handleButtonClick(e);
    }
  };

  return (
    <div className="course-card grid-mode border rounded">
      <div
        className={`course-image-wrapper${handleButtonClick ? ' course-image-clickable' : ''}`}
        onClick={handleButtonClick ? handlePrimaryAction : undefined}
        onKeyDown={handleButtonClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePrimaryAction(e);
          }
        } : undefined}
        role={handleButtonClick ? 'button' : undefined}
        tabIndex={handleButtonClick ? 0 : undefined}
      >
        <img
          src={course.image || PlaceholderImage} 
          alt={course.title}
          className="course-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PlaceholderImage;
          }}
        />
        {hasDisplayValue(course.category) && 
        <span className="badge position-absolute">
          {course.category}
        </span>
        }
        {handleRemove && (
          <button
            className="position-absolute close-icon bg-light border-0 rounded-circle d-flex align-items-center justify-content-center"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(e);
            }}
            aria-label={formatMessage(messages['dashboard.removeWishlist.ariaLabel'])}
          >
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
        )}
      </div>

      <div className="p-4 d-flex flex-column h-100">
        {hasDisplayValue(course.title) &&
          <h4 className="mb-2 course-title-grid">{course.title}</h4>
        }
        {progresscard ? (
          <>
            <div className="course-card-progress text-end">
              <div className="text-muted mb-1 text-right course-card-progress-value">{course.progress}%</div>
              <ProgressBar
                now={course ? course.progress : 0}
                max={100}
                variant="primary"
                className="flex-grow-1 mb-3 rounded"
              />
            </div>
          </>
        ) : (
          <div className="course-card-content-container-grid">
            {hasDisplayValue(course.description) &&
            <p className="text-muted course-short-discription-grid mb-3 flex-grow-1">
              {course.description}
            </p>
            }

            {showMeta && (
              <div className="d-flex flex-wrap gap-3 text-muted mb-3 course-card-meta">
                {hasDisplayValue(course.duration) &&
                <div className="course-card-meta-item mr-4">
                  <FontAwesomeIcon icon={faClock} className="me-1 mr-2" />
                  {course.duration}
                </div>
                }
                {hasDisplayValue(course.level) &&
                <div className="course-card-meta-item">
                  <FontAwesomeIcon icon={faChartLine} className="me-1 mr-2" />
                  {course.level}
                </div>
                }
              </div>
            )}
            {showRating &&
            <div className="d-flex align-items-center mb-4 course-card-rating">
              <FontAwesomeIcon icon={faStar} className="me-1 text-warning mr-2" />
              {course.rating} ({course.reviews})
            </div>
            }
            {showInstructor &&
            <div className="d-flex align-items-center mb-4 course-card-instructor">
              <FontAwesomeIcon icon={faUser} className="me-2 text-muted mr-2" />
              <span>{course.instructor}</span>
            </div>
            }
          </div>
        )}
        <Button block variant="primary" className='text-white' onClick={(e) => {
          e.stopPropagation();
          handlePrimaryAction(e);
        }}>
          {buttonName}
        </Button>
      </div>
    </div>
  )
}

export default CourseCard;