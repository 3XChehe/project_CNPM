// require("dotenv").config();
import jwt from "jsonwebtoken";

const nonSecurePaths = ["/", "/login", "/register"];

const CreateJWT = (payload) => {
  let secretKey = process.env.JWT_SECRET_KEY;
  let token = null;
  try {
    token = jwt.sign(payload, secretKey, {
      expiresIn: "1d", // 1 day
    });
  } catch (e) {
    console.log("Error: ", e);
  }
  return token;
};

const VerifyJWT = (token) => {
  let secretKey = process.env.JWT_SECRET_KEY;
  let decoded = null;
  try {
    decoded = jwt.verify(token, secretKey);
  } catch (e) {
    console.log("Error: ", e);
  }
  return decoded;
};

const JWTcheckUser = (req, res, next) => {
  console.log("req.path:", req.path);

  if (nonSecurePaths.includes(req.path)) {
    return next();
  }
  let cookies = req.cookies;
  console.log("cookies:", cookies);
  if (cookies && cookies.token) {
    let token = cookies.token;
    console.log("token:", token);

    let decoded = VerifyJWT(token);
    if (decoded) {
      let data = decoded;
      console.log("token decoded >>>:", data);

      req.user = data;
      next();
    }
    if (!decoded) {
      return res.status(401).json({
        EM: "Unauthorized",
        EC: 1,
        DT: "",
      });
    }
  } else {
    res.status(401).json({
      EM: "Unauthorized",
      EC: 1,
      DT: "",
    });
  }
};

export { CreateJWT, VerifyJWT, JWTcheckUser };
