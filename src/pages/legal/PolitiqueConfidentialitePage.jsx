import React from 'react';
import { Link } from 'react-router-dom';

const PolitiqueConfidentialitePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dernière mise à jour</h2>
              <p className="text-gray-600">[Date du jour]</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Données collectées</h2>
              <p className="text-gray-600">
                Nous collectons uniquement les informations nécessaires au bon fonctionnement du site :
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li><strong>Email</strong> : utilisé pour l'inscription et l'accès au compte.</li>
                <li><strong>Pseudo</strong> : utilisé pour identifier les utilisateurs dans les pronostics.</li>
                <li><strong>Données de navigation</strong> : via Google Analytics (statistiques d’utilisation, pages visitées...).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Finalité de la collecte</h2>
              <p className="text-gray-600">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Vous permettre d’accéder à votre compte et d’interagir avec le site.</li>
                <li>Afficher vos pronostics et ceux des autres utilisateurs.</li>
                <li>Améliorer le site grâce aux statistiques de navigation (Google Analytics).</li>
              </ul>
              <p className="text-gray-600">
                Nous <strong>ne revendons pas</strong> vos données et ne les utilisons pas à des fins commerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hébergement et stockage</h2>
              <p className="text-gray-600">
                Vos données sont stockées de manière sécurisée sur <strong>Firebase (Google Cloud Platform)</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies et suivi</h2>
              <p className="text-gray-600">
                Nous utilisons <strong>Google Analytics</strong> pour analyser le trafic du site. Google peut déposer des cookies sur votre appareil.
                Vous pouvez gérer vos préférences en matière de cookies via votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos droits</h2>
              <p className="text-gray-600">
                Conformément au <strong>RGPD</strong>, vous avez le droit de :
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Accéder à vos données.</li>
                <li>Demander la modification ou la suppression de vos données.</li>
                <li>Retirer votre consentement à tout moment.</li>
              </ul>
              <p className="text-gray-600">
                Vous pouvez supprimer votre compte via l'option prévue dans les paramètres du site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Partage des données</h2>
              <p className="text-gray-600">
                Nous ne partageons pas vos informations avec des tiers, sauf dans les cas suivants :
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Obligation légale (demande des autorités).</li>
                <li>Services Google Analytics (statistiques anonymisées).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-600">
                Pour toute question ou demande concernant vos données personnelles, vous pouvez nous contacter à :
              </p>
              <p className="text-gray-600 font-semibold">📧 [Ton adresse email de contact]</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mise à jour</h2>
              <p className="text-gray-600">
                Cette politique de confidentialité peut être modifiée à tout moment. Les utilisateurs seront informés des changements importants.
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

export default PolitiqueConfidentialitePage;