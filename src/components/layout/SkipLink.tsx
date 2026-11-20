import "./SiteHeader.css";

/**
 * Accessible skip link allowing keyboard users to bypass the sticky header
 * and jump straight to the main content landmark.
 */
export function SkipLink() {
  return (
    <a href="#contenido-principal" className="skip-link visually-hidden">
      Saltar al contenido principal
    </a>
  );
}
