const adminMiddleware = (req, res, next) => {
  const role = String(req.user?.role || '').toLowerCase();

  if (req.user && (role === 'admin' || role === 'superadmin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

module.exports = adminMiddleware;