import React from 'react';
import { Link } from 'react-router-dom';

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mentions Légales</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Site Indépendant</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Miss'Prono est un site indépendant et n'est en aucun cas affilié à Miss France SAS ou à toute autre entité officielle du concours Miss France. 
                Ce site est une initiative de fans permettant aux passionnés de partager leurs pronostics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Droits d'Auteur</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Les photos utilisées sur ce site restent la propriété exclusive de leurs auteurs respectifs. 
                Si vous êtes propriétaire d'une image et souhaitez qu'elle soit retirée, veuillez nous contacter.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Protection des Données</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Les données personnelles collectées (pseudo, email) sont uniquement utilisées pour le bon fonctionnement du site et la gestion des comptes utilisateurs. 
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez un droit d'accès, de rectification et de suppression de vos données. 
                Pour exercer ce droit, contactez-nous à l'adresse mentionnée ci-dessous.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Responsabilité</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Miss'Prono ne peut être tenu responsable des contenus publiés par ses utilisateurs, ni des erreurs ou omissions présentes sur le site. 
                Les informations partagées sont purement indicatives et n'ont aucune valeur contractuelle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Hébergement</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Ce site est hébergé par : <br/>
                PlanetHoster <br/>
                4416 Louis B. Mayer <br/>
                support@planethoster.info
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Contact</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Pour toute question ou réclamation concernant le site ou les données personnelles, vous pouvez nous contacter via : <br/>
                Email : kuroro.lucifer.phantom@gmail.com <br/>
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