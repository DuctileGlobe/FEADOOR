const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/search', internshipController.searchByCompany);
router.get('/public', internshipController.listInternships);
router.get('/public/:id', internshipController.getInternship);

// Rotas protegidas (requer autenticação)
router.use(authenticateToken);
router.post('/', internshipController.createInternship);
router.get('/my-reviews', internshipController.listUserInternships);
router.put('/:id', internshipController.updateInternship);
router.delete('/:id', internshipController.deleteInternship);

module.exports = router; 