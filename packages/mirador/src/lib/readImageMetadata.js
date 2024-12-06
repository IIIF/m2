/** Extract metadata from an image File */
export function readImageMetadata(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve({
          height: image.height,
          name: file.name,
          type: file.type,
          url: reader.result,
          width: image.width,
        });
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}
