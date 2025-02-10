import express, { RequestHandler } from "express";

const router = express.Router();

router.get<RequestHandler>("/", (req, res) => {
  res.json({
    message: "API Portal",
  });
});

export default router;
