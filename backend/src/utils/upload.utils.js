import cloudinary from '../lib/cloudinary.js';

export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const folderPath = "connectly/" + folder;
    const result = await cloudinary.uploader.upload(filePath, { folder: folderPath });
    return result;
  } catch (error) {
    throw new Error('Error uploading file to Cloudinary: ' + error.message);
  }
};