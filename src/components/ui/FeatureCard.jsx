import React from 'react';

const FeatureCard = ({ icon, title, description, features = [] }) => {
  return (
    <div className="feature-card h-100">
      <div className="text-center mb-4">
        <div className="fs-1 mb-3" style={{ fontSize: '3rem' }}>
          {icon}
        </div>
        <h3 className="h4 fw-bold text-dark mb-3">{title}</h3>
        <p className="text-muted mb-4">{description}</p>
      </div>
      
      {features.length > 0 && (
        <div className="text-start">
          <ul className="list-unstyled mb-0">
            {features.map((feature, index) => (
              <li key={index} className="d-flex align-items-center mb-2">
                <span className="text-success me-2">✓</span>
                <span className="text-muted">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeatureCard; 