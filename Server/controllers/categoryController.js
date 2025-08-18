// controllers/categoryController.js
const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  
  try {
    const categories = await Category.findAll(limit, offset);
    return res.status(200).json({
      success: true,
      categories: categories
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get category by ID
exports.getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  
  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: 'Category ID is required'
    });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return res.status(200).json({
      success: true,
      category: category
    });
  } catch (err) {
    console.error('Error fetching category:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Create new category
exports.createCategory = async (req, res) => {
  const { name, description, icon } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Category name is required'
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Category name must be 100 characters or less'
    });
  }

  if (icon && icon.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Icon must be 100 characters or less'
    });
  }

  try {
    const categoryData = {
      name: name.trim(),
      description: description || null,
      icon: icon || null
    };

    const newCategory = await Category.create(categoryData);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (err) {
    console.error('Error creating category:', err);
    
    // Handle unique constraint violations
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Update category
exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const updateData = req.body;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: 'Category ID is required'
    });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Validation
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Category name cannot be empty'
        });
      }
      
      if (updateData.name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Category name must be 100 characters or less'
        });
      }
      
      updateData.name = updateData.name.trim();
    }

    if (updateData.icon !== undefined && updateData.icon && updateData.icon.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Icon must be 100 characters or less'
      });
    }

    const updatedCategory = await Category.update(categoryId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (err) {
    console.error('Error updating category:', err);
    
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Delete category
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: 'Category ID is required'
    });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await Category.delete(categoryId);
    
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    
    // Handle foreign key constraint violations
    if (err.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete category as it is being used by other records'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Search categories
exports.searchCategories = async (req, res) => {
  const { q, limit = 20, offset = 0 } = req.query;
  
  if (!q || q.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  try {
    const categories = await Category.search(q.trim(), parseInt(limit), parseInt(offset));
    
    return res.status(200).json({
      success: true,
      categories: categories,
      searchQuery: q.trim()
    });
  } catch (err) {
    console.error('Error searching categories:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get categories with product count
exports.getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.findAllWithProductCount ? 
      await Category.findAllWithProductCount() :
      await Category.findAll();
    
    return res.status(200).json({
      success: true,
      categories: categories
    });
  } catch (err) {
    console.error('Error fetching categories with count:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get popular categories
exports.getPopularCategories = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const categories = await Category.findPopular ? 
      await Category.findPopular(limit) :
      await Category.findAll(limit, 0);
    
    return res.status(200).json({
      success: true,
      categories: categories
    });
  } catch (err) {
    console.error('Error fetching popular categories:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Toggle category status (if you have a status field)
exports.toggleCategoryStatus = async (req, res) => {
  const categoryId = req.params.id;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: 'Category ID is required'
    });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const newStatus = category.status === 'active' ? 'inactive' : 'active';
    const updatedCategory = await Category.updateStatus ?
      await Category.updateStatus(categoryId, newStatus) :
      await Category.update(categoryId, { status: newStatus });

    return res.status(200).json({
      success: true,
      message: `Category ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      category: updatedCategory
    });
  } catch (err) {
    console.error('Error toggling category status:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}