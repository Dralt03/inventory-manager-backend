import { User } from "../models/user.model.js";
import { data } from "../seed.js";

const findUserById = async (req, res, next) => {
  const { userId } = req.params.userId;
  try {
    const user = data.filter((user) => user.id === userId);
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send({ message: "Error finding user" });
  }
};

export default findUserById;
