export const getImageUrl = (photoPath: string | undefined): string => {
  if (!photoPath) return '';
  
  if (photoPath.startsWith('http')) {
    return photoPath;
  }
  
  return `http://localhost:3001${photoPath}`;
};
