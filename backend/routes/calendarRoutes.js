const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

router.get('/events', calendarController.getRecipes);
router.post('/events', calendarController.createEvent);
router.delete('/events/:recipeId', calendarController.deleteRecipe);

module.exports = router; 