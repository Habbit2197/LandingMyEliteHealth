// Datos que cambian sin tocar el diseño. Revisa cada uno antes de publicar.
export const SITE = {
  name: 'MyEliteHealth',
  version: '1.1.2',
  company: 'Amber Muscle S.L.',
  cif: 'B75723957',
  // Enlace de la App Store. Vacío = los botones bajan a la sección «Descargar».
  appStoreURL: '',
  contactEmail: 'director@ambermuscle.com',
};

export const PRICES = {
  sport: '4,99 €',
  premium: '19,99 €',
};

// Enlace de descarga que usan todos los botones.
export const downloadHref = SITE.appStoreURL || '#descargar';
