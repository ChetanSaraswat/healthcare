const router = require('express').Router();

// Health and base routes
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'omkar-healthcare-backend',
    timestamp: new Date().toISOString(),
  });
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
