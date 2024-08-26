import express from "express";

const router = express.Router();

const suggestions = [
  "Máy tính xách tay",
  "Đồng hồ",
  "Apple",
  "Samsung",
  "Xiaomi",
  "Máy ảnh",
  "Ram desktop",
  "Quạt",
  "Tivi",
  "lọc không khí",
  "màn hình lcd",
  "máy in laser",
  "cpu intel",
  "ssd",
];

router.get("/", (req, res) => {
  // pick 5 random suggestions
  const limit = Math.min(parseInt(req.query.limit) || 5, suggestions.length);
  const shuffled = suggestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, limit);
  res.json(selected);
});

export default router;