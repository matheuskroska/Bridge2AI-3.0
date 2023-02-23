const sharp = require("sharp");

const validateMask = async (mask, image) => {
  if (!mask) {
    if (image.filepath) {
      const img = sharp(image.filepath);
      return img.metadata().then((metadata) => {
        if (metadata.format === "png" && metadata.alpha === false) {
          return "If mask is not provided, image must have transparency, which will be used as the mask";
        }
        return null;
      });
    } else {
      return "Mask is required";
    }
  }

  // Check if the file is a PNG
  if (!mask.mimetype || mask.mimetype !== "image/png") {
    return "Mask must be a PNG file";
  }

  // Check the file size
  if (mask.size > 4000000) {
    return "Mask must be less than 4MB";
  }

  // Check if the mask has the same dimensions as the image
  const img = sharp(image.filepath);
  const maskImg = sharp(mask.filepath);
  return Promise.all([img.metadata(), maskImg.metadata()]).then(
    ([imgMetadata, maskMetadata]) => {
      if (
        imgMetadata.width !== maskMetadata.width ||
        imgMetadata.height !== maskMetadata.height
      ) {
        return "Mask must have the same dimensions as the image";
      }
      return null;
    }
  );
};

module.exports = validateMask;
