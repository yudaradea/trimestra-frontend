<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-primary">My Favorites</h1>
          <div class="flex items-center space-x-3">
            <button
              @click="toggleViewMode"
              class="p-2 transition-colors rounded-lg hover:bg-gray-100"
            >
              <GridIcon
                v-if="viewMode === 'list'"
                class="w-5 h-5 text-gray-600"
              />
              <ListIcon v-else class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner text="Loading favorites..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="py-12 text-center">
        <div
          class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full"
        >
          <HeartIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900">
          No Favorites Yet
        </h2>
        <p class="mb-6 text-gray-600">
          Start adding foods and recipes to your favorites to see them here.
        </p>
        <div class="flex flex-col justify-center gap-3 sm:flex-row">
          <Button @click="goToFoods" variant="primary"> Explore Foods </Button>
          <Button @click="goToRecipes" variant="outline">
            Browse Recipes
          </Button>
        </div>
      </div>

      <!-- Favorites List/Grid -->
      <div v-else>
        <!-- Filter Tabs -->
        <div class="flex p-1 mb-6 space-x-1 bg-gray-100 rounded-lg">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            @click="activeFilter = tab.key"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
              activeFilter === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            {{ tab.label }} ({{ getFilteredFavorites(tab.key).length }})
          </button>
        </div>

        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-2 gap-4">
          <div
            v-for="favorite in displayedFavorites"
            :key="favorite.id"
            class="relative card group"
          >
            <div class="relative">
              <img
                :src="getItemImage(favorite)"
                :alt="getItemName(favorite)"
                class="object-cover w-full h-40 rounded-t-xl"
                @error="handleImageError"
              />
              <button
                @click="removeFavorite(favorite.id)"
                class="absolute p-2 transition-opacity rounded-full opacity-0 top-2 right-2 bg-white/80 backdrop-blur-sm group-hover:opacity-100"
              >
                <TrashIcon class="w-4 h-4 text-red-500" />
              </button>
            </div>

            <div class="p-3">
              <h3 class="mb-1 text-sm font-medium line-clamp-2">
                {{ getItemName(favorite) }}
              </h3>
              <div
                class="flex items-center justify-between text-xs text-gray-500"
              >
                <span v-if="favorite.food">
                  {{ Math.round(favorite.food.calories) }} cal
                </span>
                <span v-else-if="favorite.recipe">
                  {{ favorite.recipe.prep_time + favorite.recipe.cook_time }}
                  min
                </span>
                <router-link
                  :to="getItemLink(favorite)"
                  class="text-primary hover:underline"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-3">
          <Card
            v-for="favorite in displayedFavorites"
            :key="favorite.id"
            class="p-4"
          >
            <div class="flex items-center">
              <img
                :src="getItemImage(favorite)"
                :alt="getItemName(favorite)"
                class="object-cover w-16 h-16 mr-4 rounded-lg"
                @error="handleImageError"
              />

              <div class="flex-1">
                <h3 class="mb-1 font-medium">{{ getItemName(favorite) }}</h3>
                <div class="flex items-center space-x-3 text-sm text-gray-600">
                  <span v-if="favorite.food">
                    <FireIcon class="inline w-4 h-4 mr-1 text-orange-500" />
                    {{ Math.round(favorite.food.calories) }} cal
                  </span>
                  <span v-else-if="favorite.recipe">
                    <ClockIcon class="inline w-4 h-4 mr-1 text-blue-500" />
                    {{ favorite.recipe.prep_time + favorite.recipe.cook_time }}
                    min
                  </span>
                  <span class="badge-primary">
                    {{ favorite.type }}
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <router-link
                  :to="getItemLink(favorite)"
                  class="p-2 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <EyeIcon class="w-5 h-5 text-gray-600" />
                </router-link>
                <button
                  @click="removeFavorite(favorite.id)"
                  class="p-2 transition-colors rounded-lg hover:bg-red-50"
                >
                  <TrashIcon class="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        <!-- ✅ PERBAIKAN: Load More hanya muncul jika ada lebih banyak data -->
        <div v-if="hasMoreItems && !loading" class="mt-6 text-center">
          <Button @click="loadMore" variant="outline"> Load More </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
const websiteUrlStorage = import.meta.env.VITE_WEBSITE_URL_STORAGE;
const websiteUrlImage = import.meta.env.VITE_WEBSITE_URL_IMAGE;

// Icons
const HeartIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
};

const GridIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>',
};

const ListIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>',
};

const TrashIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>',
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
const userStore = useUserStore();

// Reactive state
const loading = ref(false);
const viewMode = ref('grid'); // 'grid' or 'list'
const activeFilter = ref('all'); // 'all', 'food', 'recipe'
const page = ref(1);
const perPage = ref(12); // Items per page
const hasMoreItems = ref(false); // ✅ PERBAIKAN: Gunakan nama yang lebih jelas

// Computed properties
const favorites = computed(() => userStore.favorites || []);

const filterTabs = computed(() => [
  { key: 'all', label: 'All' },
  { key: 'food', label: 'Foods' },
  { key: 'recipe', label: 'Recipes' },
]);

// ✅ PERBAIKAN: Computed untuk filtered favorites
const filteredFavorites = computed(() => {
  return getFilteredFavorites(activeFilter.value);
});

// ✅ PERBAIKAN: Computed untuk displayed favorites (dengan pagination)
const displayedFavorites = computed(() => {
  const startIndex = (page.value - 1) * perPage.value;
  const endIndex = startIndex + perPage.value;
  return filteredFavorites.value.slice(startIndex, endIndex);
});

// ✅ PERBAIKAN: Computed untuk cek apakah ada lebih banyak items
const hasMore = computed(() => {
  return filteredFavorites.value.length > page.value * perPage.value;
});

// Methods
const getFilteredFavorites = (filter) => {
  if (filter === 'all') return favorites.value;

  return favorites.value.filter((fav) => fav.type === filter);
};

const getItemImage = (favorite) => {
  if (favorite.food?.image_path) {
    return websiteUrlStorage + favorite.food.image_path;
  } else if (favorite.recipe?.food?.image_path) {
    return websiteUrlStorage + favorite.recipe.food.image_path;
  }
  return websiteUrlImage + 'default-food.png';
};

const getItemName = (favorite) => {
  if (favorite.food) {
    return favorite.food.name;
  } else if (favorite.recipe) {
    return favorite.recipe.title;
  }
  return 'Unknown Item';
};

const getItemLink = (favorite) => {
  if (favorite.food) {
    return `/foods/${favorite.food.id}`;
  } else if (favorite.recipe) {
    return `/recipes/${favorite.recipe.id}`;
  }
  return '#';
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
};

const removeFavorite = async (favoriteId) => {
  if (confirm('Are you sure you want to remove this from favorites?')) {
    try {
      await userStore.removeFavorite(favoriteId);

      // ✅ PERBAIKAN: Reset pagination jika perlu
      if (displayedFavorites.value.length === 0 && page.value > 1) {
        page.value = Math.max(1, page.value - 1);
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }
};

// ✅ PERBAIKAN: Load more dengan pagination yang benar
const loadMore = () => {
  if (hasMore.value) {
    page.value++;
  }
};

const fetchFavorites = async () => {
  loading.value = true;
  try {
    await userStore.fetchFavorites();

    // ✅ PERBAIKAN: Reset pagination setiap kali fetch baru
    page.value = 1;

    // ✅ PERBAIKAN: Update hasMoreItems berdasarkan jumlah data
    hasMoreItems.value = favorites.value.length > perPage.value;
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  activeFilter.value = 'all';
  page.value = 1;
  hasMoreItems.value = favorites.value.length > perPage.value;
};

const goToFoods = () => {
  router.push('/foods');
};

const goToRecipes = () => {
  router.push('/recipes');
};

const handleImageError = (event) => {
  event.target.src = websiteUrlImage + 'default-food.png';
};

// Lifecycle
onMounted(async () => {
  await fetchFavorites();
});

// ✅ PERBAIKAN: Watch untuk update hasMoreItems
watch([favorites, activeFilter, page], () => {
  hasMoreItems.value =
    filteredFavorites.value.length > page.value * perPage.value;
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
