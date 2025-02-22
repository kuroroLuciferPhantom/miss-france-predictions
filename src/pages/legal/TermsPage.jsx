import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Conditions d'Utilisation</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Utilisation du Service</h2>
              <p className="text-gray-600 mb-4 dark:text-gray-300">
                En utilisant Miss'Prono, vous acceptez les présentes conditions d'utilisation.
                Le service est fourni à titre gratuit et dans un but ludique et communautaire.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 dark:text-gray-300">
                <li>Vous devez avoir plus de 13 ans pour utiliser ce service.</li>
                <li>Vous êtes responsable de la confidentialité de votre compte.</li>
                <li>Vos pronostics peuvent être rendus publics selon vos paramètres.</li>
                <li>L'utilisation abusive du service peut entraîner la suspension du compte.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Propriété Intellectuelle</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Le nom "Miss France" est une marque déposée par Miss France SAS.
                Les photos des candidates restent la propriété de leurs auteurs respectifs.
                L'utilisation de ces éléments est strictement limitée au cadre des pronostics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Limitation de Responsabilité</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Miss'Prono ne peut être tenu responsable des erreurs dans les informations fournies.
                Le site peut être indisponible temporairement pour maintenance ou mises à jour.
                Les utilisateurs sont seuls responsables de leurs choix et interprétations des données affichées sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comportement des Utilisateurs</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Tout comportement inapproprié, insultant ou diffamatoire entraînera une suspension immédiate du compte.
                Les utilisateurs s'engagent à respecter les règles de bienveillance et de respect sur la plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Modification des Conditions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment.
                Les utilisateurs seront informés des changements importants par notification sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Pour toute question ou réclamation concernant ces conditions, veuillez nous contacter à : <br/>
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

export default TermsPage;