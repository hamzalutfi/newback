const { jwtDecode } = require("jwt-decode");
const user = require("../models/user");
const bearer = async (req, res, next) => {
  const token = req.headers["authorization"];
  const userToken = token.split(" ")[1];
  const { id } = jwtDecode(userToken);
  //console.log(id)
  const currenttUser = await user.findOne({ _id: id });
  if (!currenttUser) {
    res.status(500).send("user not found");
    return;
  }
  req.user = currenttUser;
  next();
};
module.exports = bearer;
