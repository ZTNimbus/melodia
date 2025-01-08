import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("stat route GET");
});

export default router;
