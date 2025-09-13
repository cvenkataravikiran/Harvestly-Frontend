import React from 'react';

const TestimonialCard = ({ rating, content, name, role }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'text-warning' : 'text-muted'}>
        ★
      </span>
    ));
  };

  return (
    <div className="testimonial-card h-100">
      <div className="mb-3">
        <div className="fs-5 mb-2">
          {renderStars(rating)}
        </div>
      </div>
      
      <blockquote className="mb-4">
        <p className="fs-6 text-muted mb-0 fst-italic">"{content}"</p>
      </blockquote>
      
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="fw-bold text-dark mb-1">{name}</h6>
          <p className="text-muted mb-1 small">{role}</p>
        </div>
        <div className="ms-3">
          <span className="badge bg-primary">
            Customer
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 