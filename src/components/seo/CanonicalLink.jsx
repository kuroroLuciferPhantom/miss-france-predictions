import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Ce composant ajoute une balise canonique au head de la page
const CanonicalLink = ({ path }) => {
  // Domaine de base de l'application
  const baseUrl = 'https://miss-prono.fr';
  
  // Construction de l'URL canonique
  const canonicalUrl = `${baseUrl}${path}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalLink;