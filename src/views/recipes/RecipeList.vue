<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-primary">Recipes</h1>
          <div class="flex items-center space-x-3">
            <button
              @click="openFilter"
              class="p-2 transition-colors rounded-lg hover:bg-gray-100"
            >
              <FilterIcon class="w-5 h-5 text-gray-600" />
            </button>
            <button
              @click="openSearch"
              class="p-2 transition-colors rounded-lg hover:bg-gray-100"
            >
              <SearchIcon class="w-5 h-5 text-gray-600" />
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
            placeholder="Search recipes..."
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
    <Modal v-model="showFilters" title="Filter Recipes" size="md">
      <div class="p-4 space-y-4">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Difficulty</label
          >
          <select v-model="filters.difficulty" class="w-full select-field">
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Cooking Time</label
          >
          <select v-model="filters.cooking_time" class="w-full select-field">
            <option value="">Any Time</option>
            <option value="<30">Less than 30 minutes</option>
            <option value="30-60">30-60 minutes</option>
            <option value=">60">More than 60 minutes</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Servings</label
          >
          <select v-model="filters.servings" class="w-full select-field">
            <option value="">Any Servings</option>
            <option value="1">1 Serving</option>
            <option value="2">2 Servings</option>
            <option value="3">3 Servings</option>
            <option value="4">4 Servings</option>
            <option value=">4">More than 4 Servings</option>
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
        <LoadingSpinner text="Loading recipes..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredRecipes.length === 0" class="py-12 text-center">
        <div
          class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full"
        >
          <BookOpenIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900">
          No Recipes Found
        </h2>
        <p class="mb-6 text-gray-600">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Button @click="clearAll" class="btn-primary">
          Clear All Filters
        </Button>
      </div>

      <!-- Recipes Grid -->
      <div v-else>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RecipeCard
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/food';
import RecipeCard from '@/components/shared/RecipeCard.vue';
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

const BookOpenIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
};

// Stores & Router
const router = useRouter();
const route = useRoute();
const foodStore = useFoodStore();

// Reactive state
const loading = ref(false);
const searchQuery = ref('');
const showFilters = ref(false);
const page = ref(1);
const hasMore = ref(true);

const filters = ref({
  difficulty: '',
  cooking_time: '',
  servings: '',
});

// ✅ PERBAIKAN: Computed properties yang benar
const filteredRecipes = computed(() => {
  return foodStore.recipes || [];
});

// Methods
const openSearch = () => {
  router.push('/search');
};

const openFilter = () => {
  showFilters.value = true;
};

// ✅ PERBAIKAN: Apply filters dengan fetch data baru
const applyFilters = async () => {
  showFilters.value = false;
  page.value = 1;
  await fetchRecipes();
};

// ✅ PERBAIKAN: Clear filters dengan fetch data baru
const clearFilters = async () => {
  filters.value = {
    difficulty: '',
    cooking_time: '',
    servings: '',
  };
  showFilters.value = false;
  page.value = 1;
  await fetchRecipes();
};

const clearSearch = async () => {
  searchQuery.value = '';
  page.value = 1;
  await fetchRecipes();
};

const clearAll = async () => {
  searchQuery.value = '';
  await clearFilters();
  page.value = 1;
  await fetchRecipes();
};

const loadMore = async () => {
  page.value++;
  await fetchRecipes();
};

// ✅ PERBAIKAN: Fetch recipes dengan semua parameter
const fetchRecipes = async () => {
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

    // Add filters
    if (filters.value.difficulty) {
      params.difficulty = filters.value.difficulty;
    }

    if (filters.value.cooking_time) {
      params.cooking_time = filters.value.cooking_time;
    }

    if (filters.value.servings) {
      params.servings = filters.value.servings;
    }

    const response = await foodStore.fetchRecipes(params);

    // Update pagination info
    if (response?.data?.meta) {
      hasMore.value =
        response.data.meta.current_page < response.data.meta.last_page;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
  } finally {
    loading.value = false;
  }
};

// ✅ PERBAIKAN: Debounce search dengan fetch data
const debounceSearch = debounce(async () => {
  page.value = 1;
  await fetchRecipes();
}, 300);

// Lifecycle
onMounted(async () => {
  loading.value = true;
  try {
    await fetchRecipes();
  } catch (error) {
    console.error('Failed to load recipes:', error);
  } finally {
    loading.value = false;
  }
});
</script>
