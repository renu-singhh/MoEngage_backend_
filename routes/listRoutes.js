const express = require("express");
const router = express.Router();
const {
  createList,
  fetchUserLists,
  deleteListByName,
} = require("./../controllers/listcontroller");

router.post("/addlist", createList);
router.get("/getlists", fetchUserLists);
router.delete("/delete/:userEmail/:name", deleteListByName);

module.exports = router;
