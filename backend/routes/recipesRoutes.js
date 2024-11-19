// routes/recipesRoutes.js
const express = require('express');
const { searchRecipes, getCategories, getRecipeById, searchRecipesByCategory } = require('../controllers/recipesController');

const router = express.Router();

router.get('/search', searchRecipes);
router.get('/categories', getCategories);
router.get('/category/:category', searchRecipesByCategory);
router.get('/:id', getRecipeById);

module.exports = router;
