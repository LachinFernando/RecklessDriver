export const stripHeaderFromBase64 = (file, result) => {
    try {
      const { type } = file;
      const header = `data:${type};base64,`;
      const parsed = result.split(header).join('');
      return parsed;
    } catch (err) {
      return result;
    }
  };

export const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const parsed = stripHeaderFromBase64(file, reader.result);
        return resolve(parsed);
      };
      reader.onerror = error => reject(error);
      return null;
    });
