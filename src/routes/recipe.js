const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {protect} = require('../middlewares/authUsers');
const {
  getRecipe,
  detailRecipe,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controller/recipe");

router
  .get("/", getRecipe)
  .get("/:idRecipe", detailRecipe)
  .post(
    "/",
    upload.fields([
      { name: "image", maxCount: 2 },
      { name: "video", maxCount: 2 },
    ]),
    insertRecipe
  )
  .put(
    "/:idRecipe",
    upload.fields([
      { name: "image", maxCount: 2 },
      { name: "video", maxCount: 2 },
    ]),
    updateRecipe
  )
  .delete("/:idRecipe", deleteRecipe);

module.exports = router;
