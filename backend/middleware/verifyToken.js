const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1]; // ✅ extract token after "Bearer"

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ will contain userId
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;
