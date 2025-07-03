import express from "express";
import cors from "cors";
import checkoutRouter from "./checkout";

const app  = express();
const port = process.env.PORT || 3000;

/* CORS before routes */
app.use(
  cors({
    origin: "http://localhost:5173",   //React dev host
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json());              // body-parser

app.get("/", (_req, res) => {
  res.send("🎉 TipJar API says hello!");
});

app.use("/checkout", checkoutRouter); // routes

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
