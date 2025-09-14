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
              @click="shareRecipe"
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
      <LoadingSpinner text="Loading recipe..." />
    </div>

    <!-- Recipe Detail Content -->
    <div v-else-if="recipe" class="container px-4 py-6 mx-auto">
      <!-- Recipe Header -->
      <div class="mb-6">
        <div class="relative mb-4">
          <img
            :src="recipeImage"
            :alt="recipe.title"
            class="object-cover w-full h-64 rounded-xl"
            @error="handleImageError"
          />
          <div class="absolute flex space-x-2 bottom-4 left-4">
            <span :class="['badge', difficultyBadgeClass(recipe.difficulty)]">
              {{ recipe.difficulty }}
            </span>
            <span v-if="recipe.is_active" class="badge-primary"> Active </span>
          </div>
        </div>

        <h1 class="mb-2 text-2xl font-bold text-gray-900">
          {{ recipe.title }}
        </h1>
        <p class="mb-4 text-gray-600">{{ recipe.food?.name }}</p>

        <!-- Recipe Stats -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <Card class="p-3 text-center">
            <ClockIcon class="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <div class="font-bold">
              {{ recipe.prep_time + recipe.cook_time }}
            </div>
            <div class="text-xs text-gray-500">Minutes</div>
          </Card>

          <Card class="p-3 text-center">
            <UserIcon class="w-6 h-6 mx-auto mb-1 text-green-500" />
            <div class="font-bold">{{ recipe.servings }}</div>
            <div class="text-xs text-gray-500">Servings</div>
          </Card>

          <Card class="p-3 text-center">
            <FireIcon class="w-6 h-6 mx-auto mb-1 text-orange-500" />
            <div class="font-bold">
              {{ Math.round(recipe.food?.calories || 0) }}
            </div>
            <div class="text-xs text-gray-500">Calories</div>
          </Card>

          <Card class="p-3 text-center">
            <StarIcon class="w-6 h-6 mx-auto mb-1 text-yellow-500" />
            <div class="font-bold">{{ recipe.ingredients?.length || 0 }}</div>
            <div class="text-xs text-gray-500">Ingredients</div>
          </Card>
        </div>
      </div>

      <!-- Ingredients -->
      <Card class="mb-6">
        <div class="p-6">
          <h2 class="mb-4 text-xl font-bold text-gray-900">Ingredients</h2>
          <ul class="space-y-2">
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="flex items-start"
            >
              <div
                class="flex-shrink-0 w-2 h-2 mt-2 mr-3 rounded-full bg-primary"
              ></div>
              <span class="text-gray-700">{{ ingredient.ingredient }}</span>
            </li>
          </ul>
        </div>
      </Card>

      <!-- Instructions -->
      <Card class="mb-6">
        <div class="p-6">
          <h2 class="mb-4 text-xl font-bold text-gray-900">Instructions</h2>
          <ol class="space-y-4">
            <li
              v-for="(instruction, index) in recipe.instructions"
              :key="index"
              class="flex"
            >
              <div
                class="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-4 text-white rounded-full bg-primary"
              >
                {{ index + 1 }}
              </div>
              <div class="pt-1">
                <p class="text-gray-700">{{ instruction.step }}</p>
              </div>
            </li>
          </ol>
        </div>
      </Card>

      <!-- Related Food Info -->
      <Card v-if="recipe.food" class="mb-6">
        <div class="p-6">
          <h2 class="mb-4 text-xl font-bold text-gray-900">
            About {{ recipe.food.name }}
          </h2>
          <p class="mb-4 text-gray-700">{{ recipe.food.description }}</p>

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div class="text-center">
              <div class="text-lg font-bold text-primary">
                {{ Math.round(recipe.food.calories) }}
              </div>
              <div class="text-xs text-gray-500">Calories</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-blue-500">
                {{ recipe.food.protein }}g
              </div>
              <div class="text-xs text-gray-500">Protein</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-green-500">
                {{ recipe.food.carbs }}g
              </div>
              <div class="text-xs text-gray-500">Carbs</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-yellow-500">
                {{ recipe.food.fat }}g
              </div>
              <div class="text-xs text-gray-500">Fat</div>
            </div>
          </div>
        </div>
      </Card>

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
        <BookOpenIcon class="w-12 h-12 text-gray-400" />
      </div>
      <h2 class="mb-2 text-xl font-semibold text-gray-900">Recipe Not Found</h2>
      <p class="mb-6 text-gray-600">
        The recipe you're looking for doesn't exist or has been removed.
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

const ClockIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

const UserIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
};

const FireIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>',
};

const StarIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>',
};

const PlusIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>',
};

const BookOpenIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
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
const recipe = ref(null);
const websiteUrlStorage = import.meta.env.VITE_WEBSITE_URL_STORAGE;
const websiteUrlImage = import.meta.env.VITE_WEBSITE_URL_IMAGE;

// Computed properties
const recipeImage = computed(() => {
  return (
    websiteUrlStorage + recipe.value?.food?.image_path ||
    websiteUrlImage + 'default-food.png'
  );
});

const isFavorite = computed(() => {
  return userStore.favorites.some(
    (fav) => fav.recipe_id === parseInt(props.id)
  );
});

// Methods
const goBack = () => {
  router.back();
};

const toggleFavorite = async () => {
  if (isFavorite.value) {
    const favorite = userStore.favorites.find(
      (fav) => fav.recipe_id === parseInt(props.id)
    );
    if (favorite) {
      await userStore.removeFavorite(favorite.id);
    }
  } else {
    await userStore.addFavorite({
      type: 'recipe',
      recipe_id: parseInt(props.id),
    });
  }
};

const shareRecipe = () => {
  if (navigator.share) {
    navigator
      .share({
        title: recipe.value.title,
        text: recipe.value.food?.description,
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
  router.push(`/diary?recipe_id=${props.id}`);
};

const addToFavorites = async () => {
  if (!isFavorite.value) {
    await userStore.addFavorite({
      type: 'recipe',
      recipe_id: parseInt(props.id),
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

const fetchRecipe = async () => {
  loading.value = true;
  try {
    const response = await foodStore.fetchRecipeDetail(props.id);

    if (response.success) {
      recipe.value = response.data;
    } else {
      recipe.value = null;
    }
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    recipe.value = null;
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event) => {
  event.target.src = websiteUrlImage + 'default-food.png';
};

// Lifecycle
onMounted(() => {
  fetchRecipe();
});
</script>
