<!-- src/views/home/Home.vue -->
<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm md:hidden">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb-1 text-xl font-bold text-primary">
              Hello, {{ user?.name || 'User' }}!
            </h1>
            <p class="text-sm text-gray-600">Welcome back to TRIMESTRAAA</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner text="Loading dashboard..." />
      </div>

      <!-- Stats Cards -->
      <div v-else>
        <div class="grid gap-4 mb-6 md:grid-cols-2">
          <!-- Calories Intake Card -->
          <Card class="p-4">
            <div class="flex items-center">
              <div class="p-2 mr-3 text-orange-600 bg-orange-100 rounded-lg">
                <UtensilsIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm text-gray-600">Calories Intake</p>
                <p class="text-xl font-bold">
                  {{ Math.round(summary.total_calories_intake || 0) }}
                </p>
                <p class="text-xs text-gray-500">
                  of {{ Math.round(summary.target_calories || 2000) }}
                </p>
              </div>
            </div>
            <div class="w-full h-2 mt-3 bg-gray-200 rounded-full">
              <div
                class="h-2 rounded-full bg-primary"
                :style="{ width: caloriesIntakePercentage + '%' }"
              ></div>
            </div>

            <!-- Empty Diary Alert -->
            <div
              v-if="summary.total_calories_intake == 0"
              class="p-3 mt-3 border border-orange-200 rounded-lg bg-orange-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <BookOpenIcon class="w-5 h-5 mr-2 text-orange-600" />
                  <span class="text-sm text-orange-800"
                    >Add your first food entry</span
                  >
                </div>
                <button
                  @click="goTo('/diary')"
                  class="text-xs font-medium text-orange-600 hover:text-orange-800"
                >
                  Add Now
                </button>
              </div>
            </div>
          </Card>

          <!-- Calories Burned Card -->
          <Card class="p-4">
            <div class="flex items-center">
              <div class="p-2 mr-3 text-blue-600 bg-blue-100 rounded-lg">
                <ActivityIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm text-gray-600">Calories Burned</p>
                <p class="text-xl font-bold">
                  {{ Math.round(summary.total_calories_burned || 0) }}
                </p>
                <p class="text-xs text-gray-500">today</p>
              </div>
            </div>
            <div class="w-full h-2 mt-3 bg-gray-200 rounded-full">
              <div
                class="h-2 bg-blue-500 rounded-full"
                :style="{ width: caloriesBurnedPercentage + '%' }"
              ></div>
            </div>

            <!-- Device Connection Alert -->
            <div
              v-if="needsDeviceConnection && summary.total_calories_burned == 0"
              class="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <DeviceIcon class="w-5 h-5 mr-2 text-blue-600" />
                  <span class="text-sm text-blue-800">Connect your device</span>
                </div>
                <button
                  @click="connectDevice"
                  class="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Connect
                </button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Quick Actions -->
        <div class="mb-6">
          <h2 class="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div class="grid grid-cols-4 gap-3">
            <button
              @click="goTo('/diary')"
              class="flex flex-col items-center p-3 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
            >
              <BookOpenIcon class="w-6 h-6 mb-2 text-primary" />
              <span class="text-xs text-gray-700">Diary</span>
            </button>

            <button
              @click="goTo('/foods')"
              class="flex flex-col items-center p-3 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
            >
              <UtensilsIcon class="w-6 h-6 mb-2 text-primary" />
              <span class="text-xs text-gray-700">Foods</span>
            </button>

            <button
              @click="goTo('/recipes')"
              class="flex flex-col items-center p-3 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
            >
              <BookIcon class="w-6 h-6 mb-2 text-primary" />
              <span class="text-xs text-gray-700">Recipes</span>
            </button>

            <button
              @click="goTo('/favorites')"
              class="flex flex-col items-center p-3 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
            >
              <HeartIcon class="w-6 h-6 mb-2 text-primary" />
              <span class="text-xs text-gray-700">Favorites</span>
            </button>
          </div>
        </div>

        <!-- Recommended Foods -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Recommended for You</h2>
            <router-link to="/foods" class="text-sm text-primary">
              View All
            </router-link>
          </div>

          <div v-if="recommendedFoodsLoading" class="flex justify-center py-8">
            <LoadingSpinner />
          </div>

          <div
            v-else-if="recommendedFoods.length > 0"
            class="grid gap-4 md:grid-cols-2"
          >
            <FoodCard
              v-for="food in recommendedFoods.slice(0, 4)"
              :key="food.id"
              :food="food"
            />
          </div>

          <div v-else class="py-8 text-center text-gray-500">
            No recommendations yet. Complete your profile to get personalized
            recommendations.
          </div>
        </div>

        <!-- Recent Diary Entries -->
        <div>
          <h2 class="mb-4 text-lg font-semibold">Recent Diary Entries</h2>

          <div v-if="diaryLoading" class="flex justify-center py-8">
            <LoadingSpinner text="Loading diary entries..." />
          </div>

          <div v-else-if="recentEntries.length > 0" class="space-y-3">
            <Card v-for="entry in recentEntries" :key="entry.id" class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    :src="getEntryImage(entry)"
                    :alt="getEntryName(entry)"
                    class="object-cover w-12 h-12 mr-3 rounded-lg"
                    @error="handleEntryImageError"
                  />
                  <div>
                    <h3 class="font-medium">
                      {{ getEntryName(entry) }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ entry.meal_type }} • {{ entry.quantity }} serving
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium">
                    {{ Math.round(entry.calories) }} cal
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(entry.date) }}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div v-else class="py-8 text-center text-gray-500">
            No diary entries yet. Start by adding your first food entry.
            <button
              @click="goTo('/diary')"
              class="block mx-auto mt-4 text-primary hover:underline"
            >
              Add your first entry
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFoodStore } from '@/stores/food';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import FoodCard from '@/components/shared/FoodCard.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

// Icons
const UtensilsIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
};

const ActivityIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
};

const BookOpenIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
};

const BookIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
};

const HeartIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
};

const DeviceIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
};

const FireIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>',
};

const ClockIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

// Router & Stores
const router = useRouter();
const authStore = useAuthStore();
const foodStore = useFoodStore();
const userStore = useUserStore();

// Reactive state
const loading = ref(false);
const recommendedFoodsLoading = ref(false);
const diaryLoading = ref(false);
const websiteUrlStorage = import.meta.env.VITE_WEBSITE_URL_STORAGE;
const websiteUrlImage = import.meta.env.VITE_WEBSITE_URL_IMAGE;

// Computed properties
const user = computed(() => authStore.user);
const summary = computed(
  () =>
    userStore.dailySummary || {
      total_calories_intake: 0,
      total_calories_burned: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
      total_fiber: 0,
      target_calories: 2000,
    }
);

const recentEntries = computed(() => userStore.recentDiaryEntries || []);
const recommendedFoods = computed(() => foodStore.recommendedFoods || []);
const needsDeviceConnection = computed(() => userStore.needsDeviceConnection);

const caloriesIntakePercentage = computed(() => {
  if (!summary.value.target_calories || summary.value.target_calories === 0) {
    return 0;
  }
  return Math.min(
    100,
    Math.round(
      (summary.value.total_calories_intake / summary.value.target_calories) *
        100
    )
  );
});

const caloriesBurnedPercentage = computed(() => {
  // Assume target for burned calories is 500 for visualization
  const target = 500;
  return Math.min(
    100,
    Math.round((summary.value.total_calories_burned / target) * 100)
  );
});

// Methods
const connectDevice = () => {
  router.push('/device-connect');
};

const goTo = (path) => {
  router.push(path);
};

const getEntryImage = (entry) => {
  if (entry.food?.image_path) {
    return websiteUrlStorage + entry.food.image_path;
  } else if (entry.recipe?.food?.image_path) {
    return websiteUrlStorage + entry.recipe.food.image_path;
  }
  return websiteUrlImage + 'default-food.png';
};

const getEntryName = (entry) => {
  if (entry.food) {
    return entry.food.name;
  } else if (entry.recipe) {
    return entry.recipe.title;
  }
  return 'Unknown Entry';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Fetch all data
const fetchData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      authStore.fetchUser(),
      userStore.fetchOnboardingProgress(),
      userStore.fetchDailySummary(),
      userStore.fetchRecentDiaryEntries(),
      foodStore.fetchRecommendedFoods(),
    ]);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
  }
};

const userAvatar = computed(() => {
  const user = authStore.user;
  if (user?.profile_photo) {
    return user.profile_photo;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'U'
  )}&color=7F9CF5&background=EBF4FF`;
});

const handleProfileImageError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.value?.name || 'U'
  )}&color=7F9CF5&background=EBF4FF`;
};

const handleEntryImageError = (event) => {
  event.target.src = '/images/default-item.jpg';
};

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>
