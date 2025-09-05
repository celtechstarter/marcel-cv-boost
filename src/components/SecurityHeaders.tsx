import { useEffect } from 'react';

// Security headers component to set CSP and other security headers
export const SecurityHeaders = () => {
  useEffect(() => {
    // Set security headers on the document
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      img-src 'self' data: https:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      frame-ancestors 'none';
      form-action 'self';
      connect-src 'self' https://*.supabase.co https://api.resend.com;
      style-src 'self' 'unsafe-inline';
      script-src 'self' 'unsafe-inline';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim();
    
    // Remove existing CSP meta tag if it exists
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingMeta) {
      existingMeta.remove();
    }
    
    document.head.appendChild(meta);

    // Set additional security headers via meta tags where possible
    const referrerPolicy = document.createElement('meta');
    referrerPolicy.name = 'referrer';
    referrerPolicy.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerPolicy);

    const permissionsPolicy = document.createElement('meta');
    permissionsPolicy.httpEquiv = 'Permissions-Policy';
    permissionsPolicy.content = 'camera=(), microphone=(), geolocation=()';
    document.head.appendChild(permissionsPolicy);

    // Respect prefers-reduced-motion
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      meta.remove();
      referrerPolicy.remove();
      permissionsPolicy.remove();
      style.remove();
    };
  }, []);

  return null; // This component doesn't render anything
};