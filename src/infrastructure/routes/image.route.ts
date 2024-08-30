import express, { Router } from "express";
import path from "path";

const router = Router();

const imagePath = path.join(__dirname, "../../../temp");
router.use("/temp", express.static(imagePath));

export default router;
