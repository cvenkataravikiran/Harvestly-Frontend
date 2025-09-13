import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const CTASection = ({ 
  title, 
  subtitle, 
  primaryButtonText, 
  primaryButtonLink, 
  secondaryButtonText, 
  secondaryButtonLink 
}) => {
  return (
    <section className="cta-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="display-5 fw-bold text-white mb-4">{title}</h2>
            <p className="fs-5 text-white-75 mb-5">{subtitle}</p>
            
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to={primaryButtonLink}>
                <Button
                  variant="light"
                  size="lg"
                  className="px-4 py-3"
                >
                  {primaryButtonText}
                </Button>
              </Link>
              
              {secondaryButtonText && secondaryButtonLink && (
                <Link to={secondaryButtonLink}>
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="px-4 py-3"
                  >
                    {secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 