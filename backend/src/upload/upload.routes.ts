import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../auth/auth.middleware";
import { prisma } from "../prisma";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Usa JPG, PNG, WebP o PDF."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post(
  "/imagen",
  requireAuth,
  upload.single("archivo"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ningún archivo" });
    }

    const url = `/uploads/${req.file.filename}`;

    res.json({ url, filename: req.file.filename });
  }
);

router.post(
  "/adjunto",
  requireAuth,
  upload.single("archivo"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ningún archivo" });
    }

    const url = `/uploads/${req.file.filename}`;

    res.json({
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  }
);

export default router;
