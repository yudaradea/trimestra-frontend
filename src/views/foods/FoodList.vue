<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-primary">Foods</h1>
          <div class="flex items-center space-x-3">
            <button
              @click="openFilter"
              class="p-2 transition-colors rounded-lg hover:bg-gray-100"
            >
              <FilterIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="sticky z-10 bg-white border-b border-gray-200 top-16">
      <div class="container px-4 py-3 mx-auto">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Search foods..."
            class="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <SearchIcon class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Modal -->
    <Modal v-model="showFilters" title="Filter Foods" size="md">
      <div class="p-4 space-y-4">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Category</label
          >
          <select v-model="filters.category_id" class="w-full select-field">
            <option value="">All Categories</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Calorie Range</label
          >
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model.number="filters.min_calories"
              type="number"
              placeholder="Min"
              class="input-field"
            />
            <input
              v-model.number="filters.max_calories"
              type="number"
              placeholder="Max"
              class="input-field"
            />
          </div>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Cooking Time</label
          >
          <select v-model="filters.cooking_time" class="w-full select-field">
            <option value="">Any Time</option>
            <option value="<15">Less than 15 minutes</option>
            <option value="15-30">15-30 minutes</option>
            <option value=">30">More than 30 minutes</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Diet Type</label
          >
          <select v-model="filters.diet_type" class="w-full select-field">
            <option value="">All Types</option>
            <option value="normal">Normal</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
        </div>
      </div>
      <template #footer>
        <Button @click="clearFilters" variant="outline"> Clear </Button>
        <Button @click="applyFilters"> Apply Filters </Button>
      </template>
    </Modal>

    <!-- Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner text="Loading foods..." />
      </div>

      <!-- Categories (Always show when not searching) -->
      <div v-if="!searchQuery && categories.length > 0" class="mb-6">
        <div class="flex pb-2 space-x-2 overflow-x-auto hide-scrollbar">
          <button
            @click="selectCategory('')"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              selectedCategory === ''
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!loading && filteredFoods.length === 0"
        class="py-12 text-center"
      >
        <div
          class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full"
        >
          <UtensilsIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900">No Foods Found</h2>
        <p class="mb-6 text-gray-600">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Button @click="clearAll" class="btn-primary">
          Clear All Filters
        </Button>
      </div>

      <!-- Foods Grid (Always show when there are foods or not searching) -->
      <div v-if="!loading && (filteredFoods.length > 0 || !searchQuery)">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FoodCard v-for="food in filteredFoods" :key="food.id" :food="food" />
        </div>

        <!-- Load More -->
        <div v-if="hasMore && !loading" class="mt-8 text-center">
          <Button @click="loadMore" variant="outline"> Load More </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/food';
import FoodCard from '@/components/shared/FoodCard.vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import { debounce } from '@/utils/helpers';

// Icons
const SearchIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
};

const FilterIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>',
};

const XIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
};

const UtensilsIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5.454" /></svg>',
};

// Router & Stores
const router = useRouter();
const route = useRoute();
const foodStore = useFoodStore();

// Reactive state
const loading = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const showFilters = ref(false);
const page = ref(1);
const hasMore = ref(true);

const filters = ref({
  category_id: '',
  min_calories: '',
  max_calories: '',
  cooking_time: '',
  diet_type: '',
});

// Computed properties
const categories = computed(() => foodStore.categories || []);
const filteredFoods = computed(() => {
  let foods = foodStore.foods || [];

  // Apply search filter
  if (searchQuery.value) {
    foods = foods.filter(
      (food) =>
        food.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        food.description
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    foods = foods.filter((food) => food.category_id === selectedCategory.value);
  }

  // Apply filters from modal
  if (filters.value.category_id) {
    foods = foods.filter(
      (food) => food.category_id === filters.value.category_id
    );
  }

  // Apply calorie filters
  if (filters.value.min_calories) {
    foods = foods.filter((food) => food.calories >= filters.value.min_calories);
  }

  if (filters.value.max_calories) {
    foods = foods.filter((food) => food.calories <= filters.value.max_calories);
  }

  // ✅ PERBAIKAN: Apply cooking time filter yang benar
  if (filters.value.cooking_time) {
    const cookingTime = filters.value.cooking_time;

    switch (cookingTime) {
      case '<15':
        foods = foods.filter(
          (food) => food.cooking_time < 15 || food.cooking_time === null
        );
        break;

      case '15-30':
        foods = foods.filter(
          (food) => food.cooking_time >= 15 && food.cooking_time <= 30
        );
        break;

      case '>30':
        foods = foods.filter((food) => food.cooking_time > 30);
        break;
    }
  }

  // Apply diet type filter
  if (filters.value.diet_type && filters.value.diet_type !== 'no_preference') {
    foods = foods.filter((food) => {
      if (!food.diet_types || food.diet_types.length === 0) {
        return true; // Foods without diet types are available to everyone
      }
      return food.diet_types.includes(filters.value.diet_type);
    });
  }

  return foods;
});

// Methods
const openSearch = () => {
  router.push('/foods/search');
};

const openFilter = () => {
  showFilters.value = true;
};

const applyFilters = async () => {
  showFilters.value = false;
  page.value = 1;
  await fetchFoods();
};

const clearFilters = () => {
  filters.value = {
    category_id: '',
    min_calories: '',
    max_calories: '',
    cooking_time: '',
    diet_type: '',
  };
  showFilters.value = false;
  page.value = 1;
  fetchFoods();
};

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId;
  page.value = 1;
  await fetchFoods();
};

const clearSearch = () => {
  searchQuery.value = '';
  page.value = 1;
  fetchFoods();
};

const clearAll = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  clearFilters();
  page.value = 1;
  fetchFoods();
};

const loadMore = async () => {
  page.value++;
  await fetchFoods();
};

const fetchFoods = async () => {
  loading.value = true;
  try {
    const params = {
      page: page.value,
      per_page: 12,
    };

    // Add search query
    if (searchQuery.value) {
      params.q = searchQuery.value;
    }

    // Add category filter (priority: selectedCategory > filters.category_id)
    const categoryId = selectedCategory.value || filters.value.category_id;
    if (categoryId) {
      params.category_id = categoryId;
    }

    // Add other filters
    if (filters.value.min_calories) {
      params.min_calories = filters.value.min_calories;
    }

    if (filters.value.max_calories) {
      params.max_calories = filters.value.max_calories;
    }

    if (filters.value.cooking_time) {
      params.cooking_time = filters.value.cooking_time;
    }

    if (filters.value.diet_type) {
      params.diet_type = filters.value.diet_type;
    }

    const response = await foodStore.fetchFoods(params);

    // Update hasMore based on pagination
    if (response?.data?.meta) {
      hasMore.value =
        response.data.meta.current_page < response.data.meta.last_page;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Failed to fetch foods:', error);
  } finally {
    loading.value = false;
  }
};
const fetchCategories = async () => {
  try {
    await foodStore.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const debounceSearch = debounce(() => {
  page.value = 1;
  fetchFoods();
}, 300);

// Watchers
watch(searchQuery, () => {
  page.value = 1;
  debounceSearch();
});

// Lifecycle
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchCategories(), fetchFoods()]);
  } catch (error) {
    console.error('Failed to load foods:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
