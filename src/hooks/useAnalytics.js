// src/hooks/useAnalytics.js
export const useAnalytics = () => {
    const trackEvent = (eventName, properties = {}) => {
        // Google Analytics
        window.gtag('event', eventName, properties);

        // Meta Pixel
        window.fbq('track', eventName, properties);
    };

    return { trackEvent };
};