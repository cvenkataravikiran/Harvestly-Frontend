import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const HeroSection = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  stats,
  background = 'gradient',
  className = ''
}) => {
  const getBackgroundClass = () => {
    switch (background) {
      case 'gradient':
        return 'gradient-primary';
      case 'solid':
        return 'bg-primary';
      case 'image':
        return 'bg-primary bg-opacity-90';
      default:
        return 'gradient-primary';
    }
  };

  return (
    <section className={`hero-section text-white position-relative overflow-hidden ${getBackgroundClass()} ${className}`}>
      {/* Background Pattern */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
        <div className="position-absolute top-0 start-0 bg-secondary rounded-circle" style={{ width: '288px', height: '288px', transform: 'translate(-50%, -50%)' }}></div>
        <div className="position-absolute bottom-0 end-0 bg-secondary rounded-circle" style={{ width: '384px', height: '384px', transform: 'translate(50%, 50%)' }}></div>
      </div>

      <div className="container position-relative py-5 py-lg-5">
        <div className="text-center">
          {/* Main Content */}
          <div className="mx-auto mb-5" style={{ maxWidth: '800px' }}>
            <h1 className="display-3 display-lg-1 fw-bold mb-4 lh-1">
              {title}
            </h1>
            <p className="fs-4 fs-lg-5 text-white-75 mb-5 lh-base mx-auto" style={{ maxWidth: '600px' }}>
              {subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
              <Link to={primaryButtonLink}>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="px-5 py-3 fs-5 shadow-lg"
                >
                  {primaryButtonText}
                </Button>
              </Link>
              
              {secondaryButtonText && secondaryButtonLink && (
                <Link to={secondaryButtonLink}>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="px-5 py-3 fs-5 border-white text-white"
                  >
                    {secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="row g-4 mt-5 pt-5 border-top border-white-25">
              {stats.map((stat, index) => (
                <div key={index} className="col-6 col-md-3 text-center">
                  <div className="fs-1 mb-2 fw-bold">
                    {stat.number}
                  </div>
                  <p className="text-white-75 fw-medium mb-0">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '64px', background: 'linear-gradient(to top, var(--white-color), transparent)' }}></div>
    </section>
  );
};

export default HeroSection; 