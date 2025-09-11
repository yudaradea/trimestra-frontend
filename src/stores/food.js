import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

export const useFoodStore = defineStore('food', () => {
  const foods = ref([]);
  const categories = ref([]);
  const recipes = ref([]);
  const recommendedFoods = ref([]);
  const loading = ref(false);

  const fetchFoods = async (params = {}) => {
    loading.value = true;
    try {
      const response = await api.get('/foods', { params });
      foods.value = response.data.data.data || [];
      return foods.value;
    } catch (error) {
      console.error('Failed to fetch foods:', error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const searchFoods = async (query, params = {}) => {
    loading.value = true;
    try {
      const response = await api.get('/foods/search', {
        params: { q: query, ...params },
      });
      foods.value = response.data.data.data || [];
      return foods.value;
    } catch (error) {
      console.error('Failed to search foods:', error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      categories.value = response.data.data || [];
      return categories.value;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  };

  const fetchRecommendedFoods = async () => {
    loading.value = true;
    try {
      const response = await api.get('/personal-foods/recommended');
      recommendedFoods.value = response.data.data.foods || [];
      return recommendedFoods.value;
    } catch (error) {
      console.error('Failed to fetch recommended foods:', error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchFoodDetail = async (id) => {
    try {
      const response = await api.get(`/foods/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch food detail:', error);
      return null;
    }
  };

  const fetchRecipes = async (params = {}) => {
    loading.value = true;
    try {
      const response = await api.get('/recipes', { params });
      recipes.value = response.data.data.data || [];
      return recipes.value;
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchRecipeDetail = async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch recipe detail:', error);
      return null;
    }
  };

  return {
    foods,
    categories,
    recipes,
    recommendedFoods,
    loading,
    fetchFoods,
    searchFoods,
    fetchCategories,
    fetchRecommendedFoods,
    fetchFoodDetail,
    fetchRecipes,
    fetchRecipeDetail,
  };
});
