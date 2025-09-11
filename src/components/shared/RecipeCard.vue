<template>
  <Card class="h-full">
    <div class="relative">
      <img
        :src="recipe.food?.image_url || '/images/default-recipe.jpg'"
        :alt="recipe.title"
        class="object-cover w-full h-48"
        @error="handleImageError"
      />
      <div class="absolute top-2 right-2">
        <button
          @click="toggleFavorite"
          class="p-2 rounded-full bg-white/80 backdrop-blur-sm"
          :class="isFavorite ? 'text-red-500' : 'text-gray-500'"
        >
          <HeartIconSolid v-if="isFavorite" class="w-5 h-5" />
          <HeartIconOutline v-else class="w-5 h-5" />
        </button>
      </div>

      <div class="absolute bottom-2 left-2">
        <span :class="['badge', difficultyBadgeClass]">
          {{ recipe.difficulty }}
        </span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="mb-1 text-lg font-semibold">{{ recipe.title }}</h3>
      <p class="mb-2 text-sm text-gray-600">{{ recipe.food?.name }}</p>

      <div class="flex items-center justify-between mb-3 text-sm text-gray-500">
        <div class="flex items-center">
          <ClockIcon class="w-4 h-4 mr-1" />
          {{ totalTime }} min
        </div>
        <div class="flex items-center">
          <UserIcon class="w-4 h-4 mr-1" />
          {{ recipe.servings }} servings
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span
            class="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full"
          >
            {{ recipe.ingredients?.length || 0 }} ingredients
          </span>
          <span
            class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full"
          >
            {{ recipe.instructions?.length || 0 }} steps
          </span>
        </div>

        <router-link
          :to="`/recipes/${recipe.id}`"
          class="text-sm font-medium text-primary hover:text-orange-600"
        >
          View Recipe
        </router-link>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';

// Icons
const HeartIconOutline = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
};

const HeartIconSolid = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',
};

const ClockIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

const UserIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
};

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

const userStore = useUserStore();

const isFavorite = computed(() => {
  return userStore.favorites.some((fav) => fav.recipe_id === props.recipe.id);
});

const totalTime = computed(() => {
  return (props.recipe.prep_time || 0) + (props.recipe.cook_time || 0);
});

const difficultyBadgeClass = computed(() => {
  const classes = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };
  return classes[props.recipe.difficulty] || 'bg-gray-100 text-gray-800';
});

const toggleFavorite = async () => {
  if (isFavorite.value) {
    // Remove favorite
    const favorite = userStore.favorites.find(
      (fav) => fav.recipe_id === props.recipe.id
    );
    if (favorite) {
      await userStore.removeFavorite(favorite.id);
    }
  } else {
    // Add favorite
    await userStore.addFavorite({
      type: 'recipe',
      recipe_id: props.recipe.id,
    });
  }
};

const handleImageError = (event) => {
  event.target.src = '/images/default-recipe.jpg';
};
</script>
