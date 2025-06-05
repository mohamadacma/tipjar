import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("🎉 TipJar API says hello!");
});

app.listen(port, () => {
  console.log(\`Server listening on http://localhost:\${port}\`);
});
