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
                Miss'Pronos est un site indépendant et n'est en aucun cas affilié à Miss France SAS ou à toute autre entité officielle du concours Miss France. 
                Ce site est une initiative de fans permettant aux passionnés de partager leurs pronostics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Droits d'Auteur</h2>
              <p className="text-gray-600">
                Les photos utilisées sur ce site restent la propriété exclusive de leurs auteurs respectifs. 
                Si vous êtes propriétaire d'une image et souhaitez qu'elle soit retirée, veuillez nous contacter.
                Aucune image protégée ne sera utilisée sans autorisation explicite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Protection des Données</h2>
              <p className="text-gray-600">
                Les données personnelles collectées (nom, adresse email, etc.) sont uniquement utilisées pour le bon fonctionnement du site et la gestion des comptes utilisateurs. 
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez un droit d'accès, de rectification et de suppression de vos données. 
                Pour exercer ce droit, contactez-nous à l'adresse mentionnée ci-dessous.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsabilité</h2>
              <p className="text-gray-600">
                Miss'Pronos ne peut être tenu responsable des contenus publiés par ses utilisateurs, ni des erreurs ou omissions présentes sur le site. 
                Les informations partagées sont purement indicatives et n'ont aucune valeur contractuelle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hébergement</h2>
              <p className="text-gray-600">
                Ce site est hébergé par : <br/>
                [Nom de l'hébergeur] <br/>
                [Adresse de l'hébergeur] <br/>
                [Contact de l'hébergeur]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-600">
                Pour toute question ou réclamation concernant le site ou les données personnelles, vous pouvez nous contacter via : <br/>
                Email : [adresse email de contact] <br/>
                Adresse postale : [adresse complète, si nécessaire]
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