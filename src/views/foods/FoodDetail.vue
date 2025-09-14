<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-primary"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
            Back
          </button>
          <div class="flex items-center space-x-3">
            <button
              @click="toggleFavorite"
              class="p-2 transition-colors rounded-lg hover:bg-gray-100"
              :class="isFavorite ? 'text-red-500' : 'text-gray-600'"
            >
              <HeartIconSolid v-if="isFavorite" class="w-5 h-5" />
              <HeartIconOutline v-else class="w-5 h-5" />
            </button>
            <button
              @click="shareFood"
              class="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ShareIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner text="Loading food details..." />
    </div>

    <!-- Food Detail Content -->
    <div v-else-if="food" class="container px-4 py-6 mx-auto">
      <!-- Food Image -->
      <div class="relative mb-6">
        <img
          :src="
            `${websiteUrlStorage}${food.image_path}` ||
            `${websiteUrlImage}default-food.png`
          "
          :alt="food.name"
          class="object-cover w-full h-64 rounded-xl"
          @error="handleImageError"
        />
        <div
          class="absolute px-3 py-1 text-sm text-white rounded-full bottom-4 left-4 bg-black/50 backdrop-blur-sm"
        >
          {{ food.category?.name }}
        </div>
      </div>

      <!-- Food Info -->
      <div class="mb-6">
        <div class="flex items-start justify-between mb-3">
          <h1 class="text-2xl font-bold text-gray-900">{{ food.name }}</h1>
          <div class="flex items-center space-x-2">
            <span v-if="food.is_pregnancy_safe" class="badge-success">
              Pregnancy Safe
            </span>
            <span v-if="food.is_active" class="badge-primary"> Active </span>
          </div>
        </div>

        <p class="mb-4 text-gray-600">{{ food.description }}</p>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
          <Card class="p-3 text-center">
            <FireIcon class="w-6 h-6 mx-auto mb-1 text-orange-500" />
            <div class="font-bold">{{ Math.round(food.calories) }}</div>
            <div class="text-xs text-gray-500">Calories</div>
          </Card>

          <Card class="p-3 text-center">
            <ProteinIcon class="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <div class="font-bold">{{ food.protein }}g</div>
            <div class="text-xs text-gray-500">Protein</div>
          </Card>

          <Card class="p-3 text-center">
            <CarbsIcon class="w-6 h-6 mx-auto mb-1 text-green-500" />
            <div class="font-bold">{{ food.carbs }}g</div>
            <div class="text-xs text-gray-500">Carbs</div>
          </Card>

          <Card class="p-3 text-center">
            <FatIcon class="w-6 h-6 mx-auto mb-1 text-yellow-500" />
            <div class="font-bold">{{ food.fat }}g</div>
            <div class="text-xs text-gray-500">Fat</div>
          </Card>
        </div>

        <!-- Additional Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="flex items-center p-3 rounded-lg bg-gray-50">
            <ClockIcon class="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <div class="text-sm text-gray-500">Cooking Time</div>
              <div class="font-medium">{{ food.cooking_time || 0 }} min</div>
            </div>
          </div>

          <div class="flex items-center p-3 rounded-lg bg-gray-50">
            <ScaleIcon class="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <div class="text-sm text-gray-500">Serving Size</div>
              <div class="font-medium">{{ food.serving_size }}</div>
            </div>
          </div>
        </div>

        <!-- Allergens -->
        <div v-if="food.allergens && food.allergens.length > 0" class="mb-6">
          <h3 class="mb-3 text-lg font-semibold">Contains Allergens</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="allergen in food.allergens"
              :key="allergen"
              class="badge-danger"
            >
              {{ allergen }}
            </span>
          </div>
        </div>

        <!-- Diet Types -->
        <div v-if="food.diet_types && food.diet_types.length > 0" class="mb-6">
          <h3 class="mb-3 text-lg font-semibold">Diet Types</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="dietType in food.diet_types"
              :key="dietType"
              class="badge-primary"
            >
              {{
                dietType
                  .replace('-', ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recipe Section -->
      <div v-if="food.recipes" class="mb-6">
        <Card>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">Recipe</h2>
              <router-link
                :to="`/recipes/${food.recipes.id}`"
                class="font-medium text-primary hover:text-orange-600"
              >
                View Full Recipe
              </router-link>
            </div>

            <h3 class="mb-3 text-lg font-semibold text-gray-900">
              {{ food.recipes.title }}
            </h3>

            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">
                  {{ food.recipes.prep_time }}
                </div>
                <div class="text-sm text-gray-500">Prep Time</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-500">
                  {{ food.recipes.cook_time }}
                </div>
                <div class="text-sm text-gray-500">Cook Time</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-500">
                  {{ food.recipes.servings }}
                </div>
                <div class="text-sm text-gray-500">Servings</div>
              </div>
            </div>

            <div class="flex items-center gap-2 mt-4 mb-4">
              <h4 class="font-medium text-gray-900">Difficulty</h4>
              <span
                :class="[
                  'badge',
                  difficultyBadgeClass(food.recipes.difficulty),
                ]"
              >
                {{ food.recipes.difficulty }}
              </span>
            </div>

            <div class="mb-4">
              <h4 class="mb-2 font-medium text-gray-900">Ingredients</h4>
              <ul class="space-y-1">
                <li
                  v-for="(ingredient, index) in food.recipes.ingredients"
                  :key="index"
                  class="flex items-start"
                >
                  <span class="mr-2 text-primary">•</span>
                  <span class="text-gray-700">{{ ingredient.ingredient }}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="mb-2 font-medium text-gray-900">Instructions</h4>
              <ol class="space-y-2">
                <li
                  v-for="(
                    instruction, index
                  ) in food.recipes.instructions.slice(0, 3)"
                  :key="index"
                  class="flex"
                >
                  <span class="mr-2 font-medium text-primary"
                    >{{ index + 1 }}.</span
                  >
                  <span class="text-gray-700">{{ instruction.step }}</span>
                </li>
              </ol>
              <div
                v-if="food.recipes.instructions.length > 3"
                class="mt-2 font-medium text-primary"
              >
                +{{ food.recipes.instructions.length - 3 }} more steps
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Action Buttons -->
      <div
        class="sticky p-4 bg-white border border-gray-200 shadow-lg bottom-4 rounded-xl"
      >
        <div class="flex space-x-3">
          <Button @click="addToDiary" class="flex-1 btn-primary">
            <PlusIcon class="w-5 h-5 mr-2" />
            Add to Diary
          </Button>
          <Button @click="addToFavorites" variant="outline" class="flex-1">
            <StarIcon class="w-5 h-5 mr-2" />
            Add to Favorites
          </Button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="py-12 text-center">
      <div
        class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full"
      >
        <UtensilsIcon class="w-12 h-12 text-gray-400" />
      </div>
      <h2 class="mb-2 text-xl font-semibold text-gray-900">Food Not Found</h2>
      <p class="mb-6 text-gray-600">
        The food you're looking for doesn't exist or has been removed.
      </p>
      <Button @click="goBack" class="btn-primary"> Go Back </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/food';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
const websiteUrlStorage = import.meta.env.VITE_WEBSITE_URL_STORAGE;
const websiteUrlImage = import.meta.env.VITE_WEBSITE_URL_IMAGE;

// Icons
const ArrowLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
};

const HeartIconOutline = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
};

const HeartIconSolid = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',
};

const ShareIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>',
};

const FireIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>',
};

const ProteinIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
};

const CarbsIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
};

const FatIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
};

const ClockIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

const ScaleIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>',
};

const PlusIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>',
};

const StarIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>',
};

const UtensilsIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>',
};

// Props
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

// Stores & Router
const router = useRouter();
const route = useRoute();
const foodStore = useFoodStore();
const userStore = useUserStore();

// Reactive state
const loading = ref(false);
const food = ref(null);
// Computed properties
const isFavorite = computed(() => {
  return userStore.favorites.some((fav) => fav.food_id === parseInt(props.id));
});

// Methods
const goBack = () => {
  router.back();
};

const toggleFavorite = async () => {
  if (isFavorite.value) {
    const favorite = userStore.favorites.find(
      (fav) => fav.food_id === parseInt(props.id)
    );
    if (favorite) {
      await userStore.removeFavorite(favorite.id);
    }
  } else {
    await userStore.addFavorite({
      type: 'food',
      food_id: parseInt(props.id),
    });
  }
};

const shareFood = () => {
  if (navigator.share) {
    navigator
      .share({
        title: food.value.name,
        text: food.value.description,
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(console.error);
  }
};

const addToDiary = () => {
  router.push(`/diary?food_id=${props.id}`);
};

const addToFavorites = async () => {
  if (!isFavorite.value) {
    await userStore.addFavorite({
      type: 'food',
      food_id: parseInt(props.id),
    });
  }
};

const difficultyBadgeClass = (difficulty) => {
  const classes = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };
  return classes[difficulty] || 'bg-gray-100 text-gray-800';
};

const fetchFood = async () => {
  loading.value = true;
  try {
    const response = await foodStore.fetchFoodDetail(props.id);

    if (response.success) {
      food.value = response.data;
    } else {
      food.value = null;
    }
  } catch (error) {
    console.error('Failed to fetch food:', error);
    food.value = null;
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event) => {
  event.target.src = websiteUrlImage + 'default-food.png';
};

// Lifecycle
onMounted(() => {
  fetchFood();
});
</script>
