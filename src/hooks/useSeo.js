// src/hooks/useSeo.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSeo({ title, description, noindex = false }) {
  const location = useLocation();
  const baseUrl = 'https://miss-prono.fr';
  const canonicalUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Mise à jour du titre
    if (title) {
      document.title = title;
    }

    // Mise à jour de la description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }

      // Mettre à jour OG description aussi
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      } else {
        const ogDescMeta = document.createElement('meta');
        ogDescMeta.setAttribute('property', 'og:description');
        ogDescMeta.setAttribute('content', description);
        document.head.appendChild(ogDescMeta);
      }
    }

    // Gestion des balises canoniques
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);

    // Gestion des balises OG:URL
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (!ogUrlTag) {
      ogUrlTag = document.createElement('meta');
      ogUrlTag.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlTag);
    }
    ogUrlTag.setAttribute('content', canonicalUrl);

    // Gestion de noindex si nécessaire
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', 'noindex, nofollow');
    } else if (robotsTag) {
      // Réinitialiser pour les pages indexables
      robotsTag.setAttribute('content', 'index, follow');
    }

    // Nettoyage au démontage du composant
    return () => {
      // Pas besoin de nettoyer car ces changements seront écrasés
      // par le prochain composant qui utilise ce hook
    };
  }, [title, description, canonicalUrl, noindex]);
}