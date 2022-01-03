const express = require("express");
const cors = require("cors");
const low = require("lowdb");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const bookingRouter = require("./routes/Hotelbooking");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ Hotelbooking: [] }).write();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HotelBooking API",
      version: "1.0.0",
      description: "Airvays Booking API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/Hotelbooking", bookingRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
