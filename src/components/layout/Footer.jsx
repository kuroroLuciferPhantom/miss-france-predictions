import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          {/* Liens */}
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
                À propos
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/mentions-legales" className="text-sm text-gray-500 hover:text-gray-900">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/conditions-utilisation" className="text-sm text-gray-500 hover:text-gray-900">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link to="/confidentialite" className="text-sm text-gray-500 hover:text-gray-900">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
                Contact
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                    Nous contacter
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 md:mt-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Miss'Pronos. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;