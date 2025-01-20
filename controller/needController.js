const need = require("../models/need");
const user = require("../models/user");

exports.getAllCases = async (req, res) => {
  try {
    const { status } = req.query;
    const findQuery = {};
    if (status) {
      findQuery.status = status;
    }
    const cases = await need.find(findQuery).populate("userDisabled");
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDonorCases = async (req, res) => {
  try {
    const { _id } = req.user;
    const cases = await need.find({ userDoner: _id }).populate("userDisabled");
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCase = async (req, res) => {
  try {
    const { _id } = req.user;
    const info = req.body;
    if (!info.title) {
      return res.status(500).send("title and description are required");
    }
    console.log(req.body);
    console.log(req.files);
    if (req.files) {
      const [file1, file2] = req.files;
      if (file1?.fieldname === "file") {
        info.file = file1?.path;
      } else {
        info.image = file1?.path;
      }
      if (file2?.fieldname === "file") {
        info.file = file2?.path;
      } else {
        info.image = file2?.path;
      }
    }
    const existPandingCase = await need
      .findOne({
        userDisabled: _id,
        status: "pending",
      })
      .select("_id");
    if (existPandingCase) {
      return res.status(500).send("you have a panding case");
    }
    const userData = await user.findById(_id);
    if (
      !userData?.disabled?.medicalReport ||
      !userData?.disabled?.name ||
      !userData?.disabled?.phone
    ) {
      return res.status(500).send("you have to complete your profile first");
    }

    const cases = await need.create({ ...info, userDisabled: _id });
    res.status(200).json(cases);
  } catch (error) {
    console.log("errorsssssssssss", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseItem = await need.findById(id);
    if (!caseItem) {
      return res.status(500).send("case not found");
    }
    res.status(200).json(caseItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCase = await need.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });
    console.log("updatedCase", updatedCase);
    if (!updatedCase) {
      return res.status(500).send("Case not found");
    }
    res.send("done");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCase = await Case.findByIdAndDelete(id);
    if (!deletedCase) {
      return res.status(500).send("Case not found");
    }
    res.send("done");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
