const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const img = new Image();
  img.src = src;
  img.crossOrigin = '';
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
});

export default loadImage;
