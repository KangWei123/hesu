/**
 * bloc 转换为 JSON
 * @param {Blob} blob
 */
export function blob2JSON(blob) {
  if (typeof blob.text !== 'undefined') {
    return blob.text().then(i => JSON.parse(i));
  }

  const reader = new FileReader();
  return new Promise((res, rej) => {
    reader.onload = () => {
      try {
        res(JSON.parse(reader.result));
      } catch (err) {
        rej(err);
      }
    };

    reader.onerror = () => {
      rej(reader.error);
    };

    reader.readAsText(blob);
  });
}
