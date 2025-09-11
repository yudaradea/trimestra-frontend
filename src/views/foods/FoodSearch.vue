<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center">
          <button
            @click="goBack"
            class="flex items-center mr-3 text-gray-600 hover:text-primary"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
            Back
          </button>
          <div class="relative flex-1">
            <input
              ref="searchInput"
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="Search foods, recipes, ingredients..."
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
    </div>

    <!-- Search Results -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="searching" class="flex justify-center py-8">
        <LoadingSpinner text="Searching..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="!searchQuery" class="py-12 text-center">
        <div
          class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full"
        >
          <SearchIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900">Search Foods</h2>
        <p class="text-gray-600">
          Enter keywords to search for foods, recipes, and ingredients
        </p>
      </div>

      <!-- No Results -->
      <div
        v-else-if="searchResults.length === 0 && !searching"
        class="py-12 text-center"
      >
        <div
          class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full"
        >
          <SearchIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900">
          No Results Found
        </h2>
        <p class="mb-6 text-gray-600">
          We couldn't find any foods matching "{{ searchQuery }}". Try different
          keywords.
        </p>
        <Button @click="clearSearch" class="btn-primary"> Clear Search </Button>
      </div>

      <!-- Search Results -->
      <div v-else-if="searchResults.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">
            Search Results for "{{ searchQuery }}"
          </h2>
          <span class="text-sm text-gray-500">
            {{ searchResults.length }} results
          </span>
        </div>

        <!-- Filter Tabs -->
        <div class="flex p-1 mb-6 space-x-1 bg-gray-100 rounded-lg">
          <button
            v-for="tab in resultTabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            {{ tab.label }} ({{ getFilteredResults(tab.key).length }})
          </button>
        </div>

        <!-- Results List -->
        <div class="space-y-4">
          <Card v-for="result in filteredResults" :key="result.id" class="p-4">
            <div class="flex items-center">
              <img
                :src="getResultImage(result)"
                :alt="getResultName(result)"
                class="object-cover w-16 h-16 mr-4 rounded-lg"
                @error="handleImageError"
              />

              <div class="flex-1">
                <h3 class="mb-1 font-medium">{{ getResultName(result) }}</h3>
                <p class="mb-2 text-sm text-gray-600 line-clamp-2">
                  {{ getResultDescription(result) }}
                </p>
                <div class="flex items-center space-x-3 text-sm text-gray-500">
                  <span v-if="result.calories">
                    <FireIcon class="inline w-4 h-4 mr-1 text-orange-500" />
                    {{ Math.round(result.calories) }} cal
                  </span>
                  <span v-if="result.cooking_time">
                    <ClockIcon class="inline w-4 h-4 mr-1 text-blue-500" />
                    {{ result.cooking_time }} min
                  </span>
                  <span class="badge-primary">
                    {{ result.type }}
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="toggleFavorite(result)"
                  class="p-2 transition-colors rounded-lg hover:bg-gray-100"
                  :class="
                    isResultFavorite(result) ? 'text-red-500' : 'text-gray-600'
                  "
                >
                  <HeartIconSolid
                    v-if="isResultFavorite(result)"
                    class="w-5 h-5"
                  />
                  <HeartIconOutline v-else class="w-5 h-5" />
                </button>
                <router-link
                  :to="getResultLink(result)"
                  class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <EyeIcon class="w-5 h-5" />
                </router-link>
              </div>
            </div>
          </Card>
        </div>

        <!-- Load More -->
        <div v-if="hasMore && !searching" class="mt-8 text-center">
          <Button @click="loadMore" variant="outline"> Load More </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/food';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import { debounce } from '@/utils/helpers';

// Icons
const ArrowLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
};

const SearchIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
};

const XIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
};

const HeartIconOutline = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
};

const HeartIconSolid = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',
};

const EyeIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>',
};

const FireIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>',
};

const ClockIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

// Stores & Router
const router = useRouter();
const route = useRoute();
const foodStore = useFoodStore();
const userStore = useUserStore();

// Refs
const searchInput = ref(null);
const searchQuery = ref(route.query.q || '');
const searching = ref(false);
const activeTab = ref('all');
const page = ref(1);
const hasMore = ref(true);

// Computed properties
const resultTabs = computed(() => [
  { key: 'all', label: 'All' },
  { key: 'food', label: 'Foods' },
  { key: 'recipe', label: 'Recipes' },
]);

const searchResults = computed(() => {
  return foodStore.foods.map((food) => ({ ...food, type: 'food' }));
});

const filteredResults = computed(() => {
  return getFilteredResults(activeTab.value);
});

// Methods
const goBack = () => {
  router.back();
};

const clearSearch = () => {
  searchQuery.value = '';
  page.value = 1;
  hasMore.value = true;
  foodStore.foods = [];
};

const getFilteredResults = (tab) => {
  if (tab === 'all') return searchResults.value;
  return searchResults.value.filter((result) => result.type === tab);
};

const getResultImage = (result) => {
  if (result.image_url) {
    return result.image_url;
  } else if (result.food?.image_url) {
    return result.food.image_url;
  }
  return '/images/default-item.jpg';
};

const getResultName = (result) => {
  if (result.type === 'food') {
    return result.name;
  } else if (result.type === 'recipe') {
    return result.title;
  }
  return 'Unknown Item';
};

const getResultDescription = (result) => {
  if (result.type === 'food') {
    return result.description;
  } else if (result.type === 'recipe') {
    return result.food?.description || 'Recipe description';
  }
  return '';
};

const getResultLink = (result) => {
  if (result.type === 'food') {
    return `/foods/${result.id}`;
  } else if (result.type === 'recipe') {
    return `/recipes/${result.id}`;
  }
  return '#';
};

const isResultFavorite = (result) => {
  if (result.type === 'food') {
    return userStore.favorites.some((fav) => fav.food_id === result.id);
  } else if (result.type === 'recipe') {
    return userStore.favorites.some((fav) => fav.recipe_id === result.id);
  }
  return false;
};

const toggleFavorite = async (result) => {
  if (isResultFavorite(result)) {
    const favorite = userStore.favorites.find(
      (fav) =>
        (result.type === 'food' && fav.food_id === result.id) ||
        (result.type === 'recipe' && fav.recipe_id === result.id)
    );
    if (favorite) {
      await userStore.removeFavorite(favorite.id);
    }
  } else {
    await userStore.addFavorite({
      type: result.type,
      [`${result.type}_id`]: result.id,
    });
  }
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    foodStore.foods = [];
    return;
  }

  searching.value = true;
  try {
    await foodStore.searchFoods(searchQuery.value, {
      page: page.value,
      per_page: 20,
    });
  } catch (error) {
    console.error('Search failed:', error);
  } finally {
    searching.value = false;
  }
};

const debounceSearch = debounce(() => {
  page.value = 1;
  performSearch();
}, 300);

const loadMore = () => {
  page.value++;
  performSearch();
};

const handleImageError = (event) => {
  event.target.src = '/images/default-item.jpg';
};

// Lifecycle
onMounted(() => {
  if (searchQuery.value) {
    performSearch();
  }
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  });
});
</script>
