// src/hooks/useSeo.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSeo({ title, description, noindex = false, canonical = true }) {
  const location = useLocation();
  const baseUrl = 'https://miss-prono.fr';
  const path = location.pathname;
  // Construire l'URL canonique en fonction du chemin actuel
  const canonicalUrl = `${baseUrl}${path}`;

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
    }

    // Gestion des balises canoniques
    if (canonical) {
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    }

    // Gestion de noindex si nécessaire
    if (noindex) {
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', 'noindex, nofollow');
    }

    // Nettoyage au démontage du composant
    return () => {
      // Pas besoin de nettoyer car ces changements seront écrasés
      // par le prochain composant qui utilise ce hook
    };
  }, [title, description, canonicalUrl, noindex, canonical]);
}