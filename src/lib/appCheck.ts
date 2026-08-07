import { app } from './firebase';

/**
 * App Check exige a cada petición un token que demuestra que viene de esta
 * web en un navegador real. Es lo que frena el abuso de `reservas`, donde las
 * reglas de Firestore validan la forma del documento pero no pueden limitar
 * cuántos se crean ni desde dónde.
 *
 * Opcional a propósito: sin VITE_RECAPTCHA_SITE_KEY no se activa, así el
 * desarrollo local y los previews funcionan sin configurar nada. Para usarlo,
 * registrar la app en Firebase Console -> App Check con reCAPTCHA v3 y poner
 * la clave de sitio en esa variable.
 *
 * El módulo se importa de forma dinámica para que su peso no entre en el
 * bundle de quien no lo tiene configurado.
 */
export async function initAppCheck() {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;

    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
    initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
    });
}
