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
  .get("/", protect, getRecipe)
  .get("/:idRecipe", protect, detailRecipe)
  .post(
    "/", protect,
    upload.fields([
      { name: "image", maxCount: 2 },
      { name: "video", maxCount: 2 },
    ]),
    insertRecipe
  )
  .put(
    "/:idRecipe", protect,
    upload.fields([
      { name: "image", maxCount: 2 },
      { name: "video", maxCount: 2 },
    ]),
    updateRecipe
  )
  .delete("/:idRecipe", protect, deleteRecipe);

module.exports = router;
