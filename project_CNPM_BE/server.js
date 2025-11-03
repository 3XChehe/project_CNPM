import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./src/config/viewEngine";
import initAPIRoutes from "./src/routes/api.js";
import { connection } from "./src/config/connectDB";
var cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8080;

// Cấu hình CORS cho tất cả các yêu cầu
app.use(
  cors({
    origin: "http://localhost:3000", // Chỉ cho phép domain này
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức HTTP được phép
    allowedHeaders: "Content-Type, Authorization", // Các headers cho phép
    credentials: true, // Cho phép gửi cookie từ client
  })
);

// cấu hình view engine
configViewEngine(app);

// cấu hình body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cấu hình cookie-parser
app.use(cookieParser());
connection();

// cấu hình các route
initAPIRoutes(app);

app.get("/", (req, res) => {
  res.render("home"); // render file views/home.ejs
});

app.listen(PORT, () => {
  console.log("App is running on http://localhost:8080");
});
