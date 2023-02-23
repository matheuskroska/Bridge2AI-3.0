const fs = require("fs");
const formidable = require("formidable");
const authenticate = require("../middleware/authenticate");
const validateImage = require("../utils/validateImage");
const validateMask = require("../utils/validateMask");
const express = require("express");
const router = express.Router();
const openai = require("../config");

router.post("/image-edit", authenticate, async (req, res, next) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const imageError = await validateImage(files.inputImage);

    const maskError = await validateMask(files.mask, files.inputImage);

    if (imageError) {
      res.status(400).send(imageError);
      return;
    }

    if (maskError) {
      res.status(400).send(maskError);
      return;
    }

    const response = await openai.createImageEdit(
      fs.createReadStream(files.inputImage.filepath),
      fs.createReadStream(files.mask.filepath),
      fields.prompt,
      fields.n || 1,
      fields.size || "256x256"
    );

    res.send(response.data);
  });
});

module.exports = router;
