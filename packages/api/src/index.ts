import express from "express";
import dotenv from "dotenv";
import router from "./router";
import path from "path";
import emailService from "./utils/emailService";
// import fileUpload from "express-fileupload";
import logger from "./utils/logger";
import setupGlobalCustomMiddleware from "./middleware";
import bodyParser from "body-parser";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const PORT = process.env.PORT ?? 4000;

// database connection
// const db = mysql.createConnection({
//   host: "203.190.153.27",
//   port: 3306,
//   user: "fizno",
//   password: "D!gimonK@475",
//   database: "fizno_dev",
// });
// db.connect(function (err) {
//   if (err) throw err;
//   logger.info("Connected!");
// });

// email service
void emailService.init();
void emailService.verifyConnection();

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "./public")));

// Setup custom middleware
setupGlobalCustomMiddleware(app);
app.use("/public", express.static("public/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

// Middleware to parse form data with express-fileupload
// app.use(fileUpload());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader("Access-Control-Expose-Headers", "x-access, x-refresh");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  next();
});

app.get("/", async (_req, res) => {
  // const users = await prisma.wp_nepaz2_users.findMany();
  // logger.info(users);
  res.sendSuccess200Response("Success", null);
});

// routes
router.forEach(route => {
  app.use(`/api/v1${route.prefix}`, route.router);
});

app.listen(PORT, async () => {
  logger.info(`Server is running 🚀🚀🚀🚀 http://localhost:${PORT}`);
});
