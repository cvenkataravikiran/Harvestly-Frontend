import React from 'react';

const StatsSection = ({ stats, background = 'primary' }) => {
  const getBackgroundClass = () => {
    switch (background) {
      case 'primary':
        return 'stats-section';
      case 'secondary':
        return 'cta-section';
      default:
        return 'stats-section';
    }
  };

  return (
    <section className={`${getBackgroundClass()} py-5`}>
      <div className="container">
        <div className="row g-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="col-6 col-md-3">
              <div className="mb-2">
                <span className="display-6 fw-bold text-white">{stat.number}</span>
              </div>
              <p className="text-white-75 mb-0 fw-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 