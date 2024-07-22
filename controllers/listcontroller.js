const List = require("../model/List");
const User = require("../model/User");

// Controller method to insert a new list
const createList = async (req, res) => {
  try {
    const { listName, list, email } = req.body;
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newList = new List({
      name: listName,
      responseCodes: list,
      userEmail: email,
    });

    const savedList = await newList.save();
    return res.status(201).json(savedList);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

const fetchUserLists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ msg: "User Email is required" });
    }

    const lists = await List.find({ userEmail: email });
    return res.status(200).json(lists);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

const deleteListByName = async (req, res) => {
  try {
    const { name, userEmail } = req.params;
    const result = await List.deleteOne({ name: name, userEmail: userEmail });
    return res.status(200).json({ msg: "Deleted Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Couldn't Delete" }, error.error.message);
  }
};

module.exports = { createList, fetchUserLists, deleteListByName };
