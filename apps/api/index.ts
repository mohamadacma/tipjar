import express from "express";
import checkoutRouter from "./checkout"; 

const app = express();
const port = process.env.PORT || 3000;

// Add JSON middleware to the main app
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("🎉 TipJar API says hello!");
});

// Mount the checkout router
app.use("/checkout", checkoutRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});