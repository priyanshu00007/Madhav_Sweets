export const getImageUrl = (url: string) => {
  if (!url) return "/placeholder.svg";
  
  if (url.includes('drive.google.com')) {
    const id = url.split('id=')[1] || url.split('/d/')[1]?.split('/')[0];
    return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
  }
  
  return url;
};
