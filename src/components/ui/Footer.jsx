import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Mission', href: '#mission' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' },
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
    ],
    farmers: [
      { name: 'Become a Farmer', href: '#farmer-signup' },
      { name: 'Farmer Resources', href: '#resources' },
      { name: 'Success Stories', href: '#stories' },
      { name: 'Training', href: '#training' },
    ],
    social: [
      { name: 'Facebook', href: '#facebook' },
      { name: 'Twitter', href: '#twitter' },
      { name: 'Instagram', href: '#instagram' },
      { name: 'LinkedIn', href: '#linkedin' },
    ],
  };

  return (
    <footer className="footer-custom py-5">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <Link to="/" className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                  <span className="text-white fw-bold fs-5">🌱</span>
                </div>
                <span className="fs-4 fw-bold text-white">Harvestly</span>
              </Link>
              <p className="text-white-75 mb-3">
                Connecting local farmers with consumers for fresh, organic produce delivered to your doorstep.
              </p>
              <div className="d-flex gap-3">
                {footerLinks.social.map((link) => (
                  <a key={link.name} href={link.href} className="text-white-75 text-decoration-none">
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              {footerLinks.company.map((link) => (
                <li key={link.name} className="mb-2">
                  <a href={link.href} className="text-white-75 text-decoration-none">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              {footerLinks.support.map((link) => (
                <li key={link.name} className="mb-2">
                  <a href={link.href} className="text-white-75 text-decoration-none">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Farmers Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">For Farmers</h6>
            <ul className="list-unstyled">
              {footerLinks.farmers.map((link) => (
                <li key={link.name} className="mb-2">
                  <a href={link.href} className="text-white-75 text-decoration-none">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Newsletter</h6>
            <p className="text-white-75 mb-3">Stay updated with fresh news</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                aria-label="Your email"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top border-white-25 pt-4 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-white-75 mb-0">
                © {currentYear} Harvestly. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-white-75 mb-0">
                Made with ❤️ for sustainable agriculture
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 