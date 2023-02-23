const sharp = require("sharp");

const validateImage = (image) => {
  if (!image) {
    return "Image is required";
  }

  // Check if the file is a PNG
  if (!image.mimetype || image.mimetype !== "image/png") {
    return "Image must be a PNG file";
  }

  // Check the file size
  if (image.size > 4000000) {
    return "Image must be less than 4MB";
  }

  const img = sharp(image.filepath);
  return img.metadata().then((metadata) => {
    if (metadata.width !== metadata.height) {
      return "Image must be square";
    }
    return null;
  });
};

module.exports = validateImage;
