/**
 * Cargador optimizado para Google Tag Manager
 * Reduce el tamaño de la carga inicial y carga GTM solo cuando es necesario
 */

// Cargar configuración
if (typeof CONFIG === 'undefined') {
    // Si CONFIG no está definido, cargar el archivo de configuración
    document.write('<script src="./js/config.js"></script>');
}

// Configuración
const GTM_ID = typeof CONFIG !== 'undefined' ? CONFIG.analytics.gtmId : 'GTM-T4BCC6P';
const DELAY_LOAD = 3000; // Tiempo en ms para cargar GTM si no hay interacción

// Función principal para cargar GTM
function loadGTM() {
    // Evitar cargas duplicadas
    if (window.gtmLoaded) return;
    window.gtmLoaded = true;
    
    console.log('Cargando Google Tag Manager...');
    
    // Cargar solo los componentes esenciales de GTM
    // Esta es una versión optimizada que reduce el tamaño de la carga
    var w = window, d = document, s = 'script', l = 'dataLayer', i = GTM_ID;
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        // Configuración para cargar solo componentes esenciales
        'config': {
            [GTM_ID]: {
                'optimize_id': '',  // Desactivar Google Optimize si no se usa
                'transport_url': '', // No usar transport_url personalizada
                'restrict_data_processing': true, // Restringir procesamiento de datos
                'limited_data_use': true // Limitar uso de datos
            }
        }
    });
    
    // Crear y añadir el script de GTM
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true;
    j.defer = true; // Añadir defer para mejorar rendimiento
    
    // Añadir parámetros para reducir tamaño
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + 
            '&l=' + l + 
            '&cx=c'; // Cargar versión compacta
    
    f.parentNode.insertBefore(j, f);
    
    // Cargar iframe para noscript
    if (document.getElementById('gtm-noscript-container')) {
        document.getElementById('gtm-noscript-container').innerHTML = 
            '<iframe src="https://www.googletagmanager.com/ns.html?id=' + GTM_ID + '" ' +
            'height="0" width="0" style="display:none;visibility:hidden"></iframe>';
    }
}

// Inicializar la carga diferida de GTM
function initDeferredGTMLoad() {
    // Cargar GTM después de interacción del usuario
    const interactionEvents = ['click', 'scroll', 'touchstart', 'keydown'];
    interactionEvents.forEach(function(event) {
        document.addEventListener(event, function() {
            // Eliminar todos los event listeners una vez que se active uno
            interactionEvents.forEach(function(e) {
                document.removeEventListener(e, loadGTM);
            });
            loadGTM();
        }, {once: true});
    });
    
    // Cargar GTM después del tiempo especificado si no ha habido interacción
    setTimeout(loadGTM, DELAY_LOAD);
}

// Iniciar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeferredGTMLoad);
} else {
    initDeferredGTMLoad();
}