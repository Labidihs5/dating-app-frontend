export const getImageUrl = (photoPath: string | undefined): string => {
  if (!photoPath) return '';
  
  if (photoPath.startsWith('http')) {
    return photoPath;
  }
  
  return `  ${photoPath}`;
};
