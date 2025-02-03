import React from 'react';
import { Link } from 'react-router-dom';

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Site Indépendant</h2>
              <p className="text-gray-600">
                Miss France Predictions est un site indépendant et n'est en aucun cas affilié à Miss France SAS ou à toute autre entité officielle du concours Miss France. 
                Ce site est une initiative de fans permettant aux passionnés de partager leurs pronostics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Droits d'Auteur</h2>
              <p className="text-gray-600">
                Les photos utilisées sur ce site restent la propriété exclusive de leurs auteurs respectifs. 
                L'utilisation de ces photos est uniquement à but informatif dans le cadre des pronostics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Protection des Données</h2>
              <p className="text-gray-600">
                Les données personnelles collectées sont uniquement utilisées dans le cadre du fonctionnement du site. 
                Aucune donnée n'est transmise à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-600">
                Pour toute question ou réclamation concernant le site ou les données personnelles, vous pouvez nous contacter via :
                [adresse email de contact]
              </p>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;