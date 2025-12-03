// Convert an image file to a base64 data URL so it can be stored directly in the API/DB.
export const uploadImageToCloudinary = async (file: File) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ secure_url: reader.result as string });
    };
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });
};
