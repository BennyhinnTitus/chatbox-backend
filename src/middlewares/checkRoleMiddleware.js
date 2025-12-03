module.exports = function checkRole(allowedRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    if (req.user.role !== allowedRole) {
      return res.status(401).json({ message: "Access denied: Insufficient role" });
    }

    next();
  };
};
