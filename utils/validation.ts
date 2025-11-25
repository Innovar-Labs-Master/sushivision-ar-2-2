// Input Validation Utilities

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateMenuItem = (data: {
  name?: string;
  description?: string;
  price?: number;
  image?: string | null;
  modelUrl?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Naam is verplicht');
  } else if (data.name.length > 100) {
    errors.push('Naam mag maximaal 100 tekens zijn');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Beschrijving is verplicht');
  } else if (data.description.length > 500) {
    errors.push('Beschrijving mag maximaal 500 tekens zijn');
  }

  if (data.price === undefined || data.price === null) {
    errors.push('Prijs is verplicht');
  } else if (data.price < 0) {
    errors.push('Prijs mag niet negatief zijn');
  } else if (data.price > 1000) {
    errors.push('Prijs mag niet hoger zijn dan €1000');
  }

  if (!data.image && !data.modelUrl) {
    errors.push('Foto of 3D model is verplicht');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRestaurantInfo = (data: {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Restaurant naam is verplicht');
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.push('Adres is verplicht');
  }

  if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
    errors.push('Ongeldig telefoonnummer formaat');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Ongeldig e-mailadres formaat');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateImageFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    errors.push('Alleen JPG, PNG of WebP bestanden zijn toegestaan');
  }

  if (file.size > maxSize) {
    errors.push(`Bestand is te groot. Maximum: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateModelFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream' // .glb files
  ];
  const allowedExtensions = ['.glb', '.gltf', '.usdz'];

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension && !allowedTypes.includes(file.type)) {
    errors.push('Alleen GLB, GLTF of USDZ bestanden zijn toegestaan');
  }

  if (file.size > maxSize) {
    errors.push(`Bestand is te groot. Maximum: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

