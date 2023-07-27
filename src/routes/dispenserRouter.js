const express = require('express');
const dispenserController = require('../controllers/dispenserController');

const router = express.Router();

router.put('/:dispenserId/open', dispenserController.openDispenser);
router.put('/dispensers/create', dispenserController.createDispenser);
router.put('/:dispenserId/close', dispenserController.closeDispenser);
router.get('/dispensers/:id', dispenserController.getDispenserInfo);
router.post('/dispensers', dispenserController.getAllDispensers);
router.get('/', dispenserController.getAllDispensers);

module.exports = router;