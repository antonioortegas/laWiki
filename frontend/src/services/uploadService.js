import axios from 'axios';
const VITE_PICTURES_API_HOST = import.meta.env.VITE_PICTURES_API_HOST;

/**
 * Uploads a file to the Cloudinary microservice and returns the uploaded image URL.
 * 
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<string>} - The Cloudinary image URL.
 * @throws {Error} - Throws an error if the upload fails.
 */
export async function uploadFileToCloudinary(file) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const formData = new FormData();
  formData.append('foto', file);

  try {
    const response = await axios.post(`${VITE_PICTURES_API_HOST}/subirFoto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Assuming the response contains the image URL in `data.imageUrl`
    if (response.data && response.data.imageUrl) {
      return response.data.imageUrl;
    } else {
      throw new Error('Unexpected response format: Missing `imageUrl`');
    }
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}
