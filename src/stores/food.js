// src/stores/food.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';

export const useFoodStore = defineStore('food', () => {
  // State
  const foods = ref([]);
  const categories = ref([]);
  const recipes = ref([]);
  const recommendedFoods = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const hasMoreRecipes = ref(false);
  const totalRecipePages = ref(1);
  const currentRecipePage = ref(1);
  const hasMoreFoods = ref(false);
  const totalFoodPages = ref(1);
  const currentFoodPage = ref(1);

  // Getters
  const getFoods = computed(() => foods.value);
  const getCategories = computed(() => categories.value);
  const getRecipes = computed(() => recipes.value);
  const getRecommendedFoods = computed(() => recommendedFoods.value);

  // ✅ PERBAIKAN: Actions dengan error handling yang benar
  const fetchFoods = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/foods', { params });

      if (response.data.success) {
        // ✅ PERBAIKAN: Handle pagination data dengan benar
        if (response.data.data && response.data.data.data) {
          // Paginated response
          foods.value = response.data.data.data;
          hasMoreFoods.value =
            response.data.data.meta?.current_page <
            response.data.data.meta?.last_page;
          totalFoodPages.value = response.data.data.meta?.last_page || 1;
          currentFoodPage.value = response.data.data.meta?.current_page || 1;
        } else if (Array.isArray(response.data.data)) {
          // Non-paginated response
          foods.value = response.data.data;
          hasMoreFoods.value = false;
          totalFoodPages.value = 1;
          currentFoodPage.value = 1;
        } else {
          // Empty response
          foods.value = [];
          hasMoreFoods.value = false;
          totalFoodPages.value = 1;
          currentFoodPage.value = 1;
        }

        return { success: true, data: foods.value };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to fetch foods:', err);
      error.value = err.response?.data?.message || 'Failed to fetch foods';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const searchFoods = async (query, params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/foods/search', {
        params: { q: query, ...params },
      });

      if (response.data.success) {
        if (response.data.data && response.data.data.data) {
          foods.value = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          foods.value = response.data.data;
        } else {
          foods.value = [];
        }
        return { success: true, data: foods.value };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to search foods:', err);
      error.value = err.response?.data?.message || 'Failed to search foods';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');

      if (response.data.success) {
        categories.value = response.data.data || [];
        return { success: true, data: categories.value };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      error.value = err.response?.data?.message || 'Failed to fetch categories';
      return { success: false, error: error.value };
    }
  };

  const fetchRecommendedFoods = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/personal-foods/recommended');

      if (response.data.success) {
        if (response.data.data && response.data.data.foods) {
          recommendedFoods.value = response.data.data.foods;
        } else if (Array.isArray(response.data.data)) {
          recommendedFoods.value = response.data.data;
        } else {
          recommendedFoods.value = [];
        }
        return { success: true, data: recommendedFoods.value };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to fetch recommended foods:', err);
      error.value =
        err.response?.data?.message || 'Failed to fetch recommended foods';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const fetchRecipes = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      // ✅ PERBAIKAN: Kirim semua parameter ke API
      const response = await api.get('/recipes', { params });

      if (response.data.success) {
        if (response.data.data && response.data.data.data) {
          // ✅ PERBAIKAN: Update recipes dengan data baru
          if (params.page === 1) {
            recipes.value = response.data.data.data;
          } else {
            // Append untuk pagination
            recipes.value = [...recipes.value, ...response.data.data.data];
          }

          hasMoreRecipes.value =
            response.data.data.meta?.current_page <
            response.data.data.meta?.last_page;
          totalRecipePages.value = response.data.data.meta?.last_page || 1;
          currentRecipePage.value = response.data.data.meta?.current_page || 1;
        } else if (Array.isArray(response.data.data)) {
          recipes.value = response.data.data;
          hasMoreRecipes.value = false;
          totalRecipePages.value = 1;
          currentRecipePage.value = 1;
        } else {
          recipes.value = [];
          hasMoreRecipes.value = false;
          totalRecipePages.value = 1;
          currentRecipePage.value = 1;
        }

        return { success: true, data: recipes.value };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      error.value = err.response?.data?.message || 'Failed to fetch recipes';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const searchRecipes = async (query, params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/recipes/search', {
        params: { q: query, ...params },
      });

      if (response.data.success) {
        if (response.data.data && response.data.data.data) {
          recipes.value = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          recipes.value = response.data.data;
        } else {
          recipes.value = [];
        }
        return { success: true, data: recipes.value };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to search recipes:', err);
      error.value = err.response?.data?.message || 'Failed to search recipes';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const fetchRecipeDetail = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/recipes/${id}`);

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to fetch recipe detail:', err);
      error.value =
        err.response?.data?.message || 'Failed to fetch recipe detail';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const fetchFoodDetail = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/foods/${id}`);

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        error.value = response.data.message;
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error('Failed to fetch food detail:', err);
      error.value =
        err.response?.data?.message || 'Failed to fetch food detail';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Reset state
  const reset = () => {
    foods.value = [];
    categories.value = [];
    recipes.value = [];
    recommendedFoods.value = [];
    loading.value = false;
    error.value = null;
    hasMoreRecipes.value = false;
    totalRecipePages.value = 1;
    currentRecipePage.value = 1;
    hasMoreFoods.value = false;
    totalFoodPages.value = 1;
    currentFoodPage.value = 1;
  };

  return {
    // State
    foods,
    categories,
    recipes,
    recommendedFoods,
    loading,
    error,
    hasMoreRecipes,
    totalRecipePages,
    currentRecipePage,
    hasMoreFoods,
    totalFoodPages,
    currentFoodPage,

    // Getters
    getFoods,
    getCategories,
    getRecipes,
    getRecommendedFoods,

    // Actions
    fetchFoods,
    searchFoods,
    fetchCategories,
    fetchRecommendedFoods,
    fetchRecipes,
    searchRecipes,
    fetchRecipeDetail,
    fetchFoodDetail,
    reset,
  };
});
