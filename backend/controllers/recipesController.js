// controllers/recipesController.js
const db = require('../config/db');

const recipesController = {
    // Buscar recetas por nombre
    searchRecipes: async (req, res) => {
        const { name } = req.query;
        console.log(`Buscando recetas con el nombre: ${name}`);
        
        try {
            const [results] = await db.query(
                'SELECT id_receta, nombre_receta, descripcion, ingredientes, instrucciones, imagen_url, tiempo_preparacion, dificultad, id_categoria FROM recetas WHERE nombre_receta LIKE ?',
                [`%${name}%`]
            );
            console.log('Resultados de la búsqueda:', results);
            res.status(200).json(results);
        } catch (error) {
            console.error('Error al buscar recetas:', error);
            res.status(500).json({ 
                error: 'Error al buscar recetas',
                details: error.message 
            });
        }
    },

    // Obtener todas las categorías
    getCategories: async (req, res) => {
        try {
            const [results] = await db.query(
                'SELECT id_categoria, nombre_categoria, imagen_url, descripcion FROM categorias'
            );
            console.log('Categorías obtenidas:', results);
            res.status(200).json(results);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            res.status(500).json({ 
                error: 'Error al obtener categorías',
                details: error.message 
            });
        }
    },

    // Obtener recetas por categoría
    searchRecipesByCategory: async (req, res) => {
        const { category } = req.params;
        console.log(`Buscando recetas para la categoría: ${category}`);
        
        try {
            const [recipes] = await db.query(
                `SELECT 
                    r.id_receta, r.nombre_receta, r.descripcion,
                    r.ingredientes, r.instrucciones, r.imagen_url,
                    r.tiempo_preparacion, r.dificultad, r.id_categoria,
                    c.descripcion AS categoria_descripcion,
                    c.nombre_categoria
                FROM recetas r
                JOIN categorias c ON r.id_categoria = c.id_categoria
                WHERE c.nombre_categoria = ?`,
                [category]
            );
            
            console.log('Recetas encontradas:', recipes);
            res.status(200).json(recipes);
        } catch (error) {
            console.error('Error al buscar recetas por categoría:', error);
            res.status(500).json({ 
                error: 'Error al buscar recetas por categoría',
                details: error.message 
            });
        }
    },

    // Obtener una receta por ID
    getRecipeById: async (req, res) => {
        const { id } = req.params;
        try {
            const [results] = await db.query(
                `SELECT recetas.*, categorias.nombre_categoria 
                FROM recetas 
                JOIN categorias ON recetas.id_categoria = categorias.id_categoria 
                WHERE recetas.id_receta = ?`,
                [id]
            );
            
            if (results.length > 0) {
                console.log("Datos de la receta enviados:", results[0]);
                res.status(200).json(results[0]);
            } else {
                res.status(404).json({ error: 'Receta no encontrada' });
            }
        } catch (error) {
            console.error('Error al obtener la receta:', error);
            res.status(500).json({ 
                error: 'Error al obtener la receta',
                details: error.message 
            });
        }
    }
};

module.exports = recipesController;

// Buscar recetas por nombre
const searchRecipes = async (req, res) => {
  const { name } = req.query;
  console.log(`Buscando recetas con el nombre: ${name}`);
  try {
    const [results] = await db.query(
      'SELECT id_receta, nombre_receta, descripcion, ingredientes, instrucciones, imagen_url, tiempo_preparacion, dificultad, id_categoria FROM recetas WHERE nombre_receta LIKE ?',
      [`%${name}%`]
    );
    console.log('Resultados de la búsqueda:', results);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al buscar recetas:', error.message); // Imprime el mensaje de error
    console.error('Stack trace:', error.stack); // Imprime el stack trace del error
    res.status(500).json({ error: 'Error al buscar recetas' });
  }
};

// Obtener todas las categorías con descripción
const getCategories = async (req, res) => {
  console.log('Intentando obtener categorías...');
  try {
    const [results] = await db.query('SELECT id_categoria, nombre_categoria, imagen_url, descripcion FROM categorias');
    console.log('Categorías obtenidas:', results);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener categorías:', error.message); // Imprime el mensaje de error
    console.error('Stack trace:', error.stack); // Imprime el stack trace del error
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener una receta por su ID
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query(`
      SELECT recetas.*, categorias.nombre_categoria 
      FROM recetas 
      JOIN categorias ON recetas.id_categoria = categorias.id_categoria 
      WHERE recetas.id_receta = ?`, [id]);
    console.log("Datos de la receta enviados:", results[0]);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'Receta no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la receta:', error);
    res.status(500).json({ error: 'Error al obtener la receta' });
  }
};

// Asegúrate de que esta función pueda filtrar recetas por categoría si se proporciona el nombre de la categoría
const searchRecipesByCategory = async (req, res) => {
  const { category } = req.params;
  console.log(`Buscando recetas para la categoría: ${category}`);
  try {
    const [recipes] = await db.query(
      `SELECT 
        r.id_receta,
        r.nombre_receta,
        r.descripcion,
        r.ingredientes,
        r.instrucciones,
        r.imagen_url,
        r.tiempo_preparacion,
        r.dificultad,
        r.id_categoria,
        c.descripcion AS categoria_descripcion,
        c.nombre_categoria
       FROM recetas r
       JOIN categorias c ON r.id_categoria = c.id_categoria
       WHERE c.nombre_categoria = ?`,
      [category]
    );
    
    console.log('Recetas encontradas:', recipes);
    
    if (recipes && recipes.length > 0) {
      res.status(200).json(recipes);
    } else {
      res.status(200).json([]); // Enviar array vacío en lugar de 404
    }
  } catch (error) {
    console.error('Error al buscar recetas por categoría:', error);
    res.status(500).json({ 
      error: 'Error al buscar recetas por categoría',
      details: error.message 
    });
  }
};

module.exports = { searchRecipes, getCategories, getRecipeById, searchRecipesByCategory };
