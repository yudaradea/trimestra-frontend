<template>
  <Card class="h-full">
    <div class="relative">
      <img
        :src="
          `${websiteUrlStorage}${food.image_path}` ||
          `${websiteUrlImage}default-food.png`
        "
        :alt="food.name"
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
    </div>

    <div class="p-4">
      <h3 class="mb-1 text-lg font-semibold">{{ food.name }}</h3>
      <p class="mb-3 text-sm text-gray-600 line-clamp-2">
        {{ food.description }}
      </p>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 text-sm">
          <span class="flex items-center">
            <FireIcon class="w-4 h-4 mr-1 text-orange-500" />
            {{ Math.round(food.calories) }} cal
          </span>
          <span class="flex items-center">
            <ClockIcon class="w-4 h-4 mr-1 text-blue-500" />
            {{ food.cooking_time || 0 }} min
          </span>
        </div>

        <router-link
          :to="`/foods/${food.id}`"
          class="text-sm font-medium text-primary hover:text-orange-600"
        >
          View Details
        </router-link>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
const websiteUrlStorage = import.meta.env.VITE_WEBSITE_URL_STORAGE;
const websiteUrlImage = import.meta.env.VITE_WEBSITE_URL_IMAGE;

// Icons
const HeartIconOutline = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
};

const HeartIconSolid = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',
};

const FireIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>',
};

const ClockIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

const props = defineProps({
  food: {
    type: Object,
    required: true,
  },
});

const userStore = useUserStore();

const isFavorite = computed(() => {
  return userStore.favorites.some((fav) => fav.food_id === props.food.id);
});

const toggleFavorite = async () => {
  if (isFavorite.value) {
    // Remove favorite
    const favorite = userStore.favorites.find(
      (fav) => fav.food_id === props.food.id
    );
    if (favorite) {
      await userStore.removeFavorite(favorite.id);
    }
  } else {
    // Add favorite
    await userStore.addFavorite({
      type: 'food',
      food_id: props.food.id,
    });
  }
};

const handleImageError = (event) => {
  event.target.src = websiteUrlImage + 'default-food.png';
};
</script>
