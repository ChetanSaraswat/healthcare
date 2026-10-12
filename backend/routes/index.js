const router = require('express').Router();
const { checkConnection } = require('../config').dbConnection;

// Health and base routes (Liveness probe)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'omkar-healthcare-backend',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe (Database connectivity verification)
router.get('/health/ready', async (req, res) => {
  try {
    await checkConnection();
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      service: 'omkar-healthcare-backend',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/', (req, res) => {
  res.send('Omkar Healthcare API Service is running');
});

// Domain sub-routers
router.use('/auth', require('./auth.router'));
router.use('/categories', require('./category.router'));
router.use('/products', require('./product.router'));
router.use('/orders', require('./order.router'));
router.use('/rentals', require('./rental.router'));
router.use('/conditions', require('./condition.router'));
router.use('/reviews', require('./review.router'));
router.use('/users', require('./user.router'));
router.use('/user', require('./user.router'));
router.use('/payments', require('./payment.router'));
router.use('/blog', require('./blog.router'));
router.use('/email', require('./email.router'));
router.use('/pages', require('./static-page.router'));
router.use('/policies', require('./static-page.router'));
router.use('/uploads', require('./upload.router'));
router.use('/upload', require('./upload.router'));

module.exports = router;
