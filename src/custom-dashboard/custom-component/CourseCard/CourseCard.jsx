import React from 'react';
import { Button, ProgressBar } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faChartLine,
  faStar,
  faUser,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import './CourseCard.scss';
import PlaceholderImage from '../../../assets/image/placeholder-image.jpeg';

const CourseCard = ({ course, progresscard = false , buttonName = "Button", handleButtonClick = null, handleRemove= null}) => {
  return (
    <div className="course-card grid-mode border rounded">
      <div className="course-image-wrapper">
        <img
          src={course.image || PlaceholderImage} 
          alt={course.title}
          className="course-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PlaceholderImage;
          }}
        />
        {course.category && 
        <span className="badge position-absolute">
          {course.category}
        </span>
        }
        {handleRemove && (
          <button
            className="position-absolute close-icon bg-light border-0 rounded-circle d-flex align-items-center justify-content-center"
            onClick={handleRemove}
            aria-label="Remove from wishlist"
          >
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
        )}
      </div>

      <div className="p-4 d-flex flex-column h-100">
        {course.title &&
          <h4 className="mb-2 course-title-grid">{course.title}</h4>
        }
        {progresscard ? (
          <>
            <div className="course-card-progress text-end">
              <div className="text-muted mb-3 text-right">{course.progress}%</div>
              <ProgressBar
                now={course ? course.progress : 0}
                max={100}
                variant="primary"
                className="flex-grow-1 mb-2 rounded"
              />
            </div>
          </>
        ) : (
          <div className="course-card-content-container-grid">
            {course.description &&
            <p className="text-muted course-short-discription-grid small mb-3 flex-grow-1">
              {course.description}
            </p>
            }

            <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
              {course.duration &&
              <div className='mr-4'>
                <FontAwesomeIcon icon={faClock} className="me-1 mr-2" />
                {course.duration}
              </div>
              }
              {course.level &&
              <div>
                <FontAwesomeIcon icon={faChartLine} className="me-1 mr-2" />
                {course.level}
              </div>
              }
            </div>
            {course.rating && course.reviews &&
            <div className="d-flex align-items-center mb-4">
              <FontAwesomeIcon icon={faStar} className="me-1 text-warning mr-2" />
              {course.rating} ({course.reviews})
            </div>
            }
            {course.instructor &&
            <div className="d-flex align-items-center mb-4">
              <FontAwesomeIcon icon={faUser} className="me-2 text-muted mr-2" />
              <span className="small">{course.instructor}</span>
            </div>
            }
          </div>
        )}
        <Button block variant="primary" onClick={handleButtonClick}>
          {buttonName}
        </Button>
      </div>
    </div>
  )
}

export default CourseCard;