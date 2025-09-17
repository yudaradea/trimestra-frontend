<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-primary">Food Diary</h1>
          <div class="flex items-center space-x-3">
            <button
              @click="openDatePicker"
              class="flex items-center text-gray-600 hover:text-primary"
            >
              <CalendarIcon class="w-5 h-5 mr-1" />
              <span class="hidden sm:inline">{{ formattedSelectedDate }}</span>
            </button>
            <button
              @click="addEntry"
              class="flex items-center px-4 py-2 text-white transition-colors rounded-full bg-primary hover:bg-orange-600"
            >
              <PlusIcon class="w-5 h-5 mr-1" />
              <span class="hidden sm:inline">Add Entry</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Picker Modal -->
    <Modal v-model="showDatePicker" title="Select Date">
      <div class="p-4">
        <input
          v-model="tempSelectedDate"
          type="date"
          class="w-full input-field"
        />
      </div>
      <template #footer>
        <Button @click="showDatePicker = false" variant="outline">
          Cancel
        </Button>
        <Button @click="confirmDateSelection"> Select </Button>
      </template>
    </Modal>

    <!-- Add Entry Modal -->
    <Modal v-model="showAddEntry" title="Add Diary Entry" size="lg">
      <div class="p-4">
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Meal Type</label
          >
          <select v-model="newEntry.meal_type" class="w-full select-field">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
            <option value="exercise">Exercise</option>
          </select>
        </div>

        <!-- Food/Recipe Selection -->
        <div v-if="newEntry.meal_type !== 'exercise'" class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Select Item</label
          >
          <div class="flex mb-3 space-x-2">
            <button
              @click="entryTab = 'favorite'"
              :class="[
                'px-4 py-2 rounded-lg',
                entryTab === 'favorite'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              Favorite
            </button>
            <button
              @click="entryTab = 'food'"
              :class="[
                'px-4 py-2 rounded-lg',
                entryTab === 'food'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              Food
            </button>
          </div>
          <div v-if="entryTab === 'favorite'">
            <div class="relative mb-3">
              <input
                v-model="favoriteSearch"
                @input="debounceSearchFavorites"
                type="text"
                placeholder="Search favorites..."
                class="w-full pl-10 input-field"
              />
              <SearchIcon
                class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
              />
            </div>

            <div class="overflow-y-auto border rounded-lg max-h-60">
              <div
                v-for="favorite in filteredFavorites"
                :key="favorite.id"
                @click="selectFavorite(favorite)"
                class="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                :class="{
                  'bg-primary/10': newEntry.favorite_id === favorite.id,
                }"
              >
                <div class="flex justify-between">
                  <span class="font-medium">{{
                    favorite.food?.name || favorite.recipe?.title
                  }}</span>
                  <span class="text-sm text-gray-500"
                    >{{
                      favorite.food?.calories || favorite.recipe?.calories
                    }}
                    cal</span
                  >
                </div>
                <div class="text-sm text-gray-500">
                  {{
                    favorite.food?.description || favorite.recipe?.description
                  }}
                </div>
              </div>
            </div>
          </div>

          <div v-else="entryTab === 'food'">
            <div class="relative mb-3">
              <input
                v-model="foodSearch"
                @input="debounceSearchFoods"
                type="text"
                placeholder="Search foods..."
                class="w-full pl-10 input-field"
              />
              <SearchIcon
                class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
              />
            </div>

            <div class="overflow-y-auto border rounded-lg max-h-60">
              <div
                v-for="food in filteredFoods"
                :key="food.id"
                @click="selectFood(food)"
                class="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-primary/10': newEntry.food_id === food.id }"
              >
                <div class="flex justify-between">
                  <span class="font-medium">{{ food.name }}</span>
                  <span class="text-sm text-gray-500"
                    >{{ Math.round(food.calories) }} cal</span
                  >
                </div>
                <div class="text-sm text-gray-500">{{ food.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantity -->
        <div v-if="newEntry.meal_type !== 'exercise'" class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Quantity</label
          >
          <input
            v-model.number="newEntry.quantity"
            type="number"
            step="0.1"
            min="0.1"
            class="w-full input-field"
            placeholder="e.g., 1.5"
          />
        </div>

        <!-- Exercise Specific Fields -->
        <div v-else class="space-y-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Exercise Type</label
            >
            <input
              v-model="newEntry.exercise_type"
              type="text"
              class="w-full input-field"
              placeholder="e.g., Walking, Jogging"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Duration (minutes)</label
            >
            <input
              v-model.number="newEntry.exercise_duration"
              type="number"
              min="1"
              class="w-full input-field"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700"
              >Calories Burned</label
            >
            <input
              v-model.number="newEntry.calories_burned"
              type="number"
              min="0"
              class="w-full input-field"
              placeholder="e.g., 150"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button @click="showAddEntry = false" variant="outline">
          Cancel
        </Button>
        <Button @click="saveEntry" :disabled="!canSaveEntry">
          <span v-if="loading" class="flex items-center justify-center">
            Saving...
          </span>
          <span v-else>Save Entry</span>
        </Button>
      </template>
    </Modal>

    <!-- Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner text="Loading diary entries..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="diaryByDate.length === 0" class="py-12 text-center">
        <div
          class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full"
        >
          <BookOpenIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900">
          No Diary Entries
        </h2>
        <p class="mb-6 text-gray-600">
          Start tracking your food and exercise by adding your first entry.
        </p>
        <Button @click="addEntry" class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Add First Entry
        </Button>
      </div>

      <!-- Diary Entries -->
      <div v-else>
        <!-- Nutrition Summary -->
        <Card class="mb-6">
          <div class="p-4">
            <h3 class="mb-3 text-lg font-semibold">Nutrition Summary</h3>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">
                  {{ Math.round(summary.total_calories_intake || 0) }}
                </div>
                <div class="text-sm text-gray-600">Calories In</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-500">
                  {{ Math.round(summary.total_calories_burned || 0) }}
                </div>
                <div class="text-sm text-gray-600">Calories Out</div>
              </div>
              <div class="text-center">
                <div
                  :class="[
                    'text-2xl font-bold',
                    (summary.net_calories || 0) >= 0
                      ? 'text-blue-500'
                      : 'text-red-500',
                  ]"
                >
                  {{ Math.round(summary.net_calories || 0) }}
                </div>
                <div class="text-sm text-gray-600">Net Calories</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-500">
                  {{ Math.round(summary.calorie_progress || 0) }}%
                </div>
                <div class="text-sm text-gray-600">Progress</div>
              </div>
            </div>

            <!-- Macronutrients -->
            <div class="pt-4 mt-4 border-t border-gray-100">
              <div class="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div class="font-medium">
                    {{ Math.round(summary.total_protein) }}g
                  </div>
                  <div class="text-xs text-gray-500">Protein</div>
                </div>
                <div>
                  <div class="font-medium">
                    {{ Math.round(summary.total_carbs) }}g
                  </div>
                  <div class="text-xs text-gray-500">Carbs</div>
                </div>
                <div>
                  <div class="font-medium">
                    {{ Math.round(summary.total_fat) }}g
                  </div>
                  <div class="text-xs text-gray-500">Fat</div>
                </div>
                <div>
                  <div class="font-medium">
                    {{ Math.round(summary.total_fiber) }}g
                  </div>
                  <div class="text-xs text-gray-500">Fiber</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Meal Entries -->
        <div class="space-y-6">
          <!-- Recent Diary Entries untuk Tanggal yang Dipilih -->
          <div v-if="diaryEntries.length > 0">
            <h2 class="mb-4 text-lg font-semibold">Recent Entries</h2>
            <div class="space-y-3">
              <Card v-for="entry in diaryByDate" :key="entry.id" class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img
                      :src="getEntryImage(entry)"
                      :alt="getEntryName(entry)"
                      class="object-cover w-12 h-12 mr-3 rounded-lg"
                      @error="handleImageError"
                    />
                    <div>
                      <h4 class="font-medium">{{ getEntryName(entry) }}</h4>
                      <div
                        class="flex items-center space-x-3 text-sm text-gray-600"
                      >
                        <span class="capitalize">{{ entry.meal_type }}</span>
                        <span>{{ entry.quantity || 1 }} serving</span>
                        <span v-if="entry.calories"
                          >{{ Math.round(entry.calories) }} cal</span
                        >
                        <span v-else-if="entry.calories_burned"
                          >{{ Math.round(entry.calories_burned) }} cal
                          burned</span
                        >
                      </div>
                    </div>
                  </div>
                  <button
                    @click="deleteEntry(entry.id)"
                    class="p-2 text-red-500 rounded-full hover:bg-red-50"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </Card>
            </div>
          </div>

          <!-- Exercise -->
          <div v-if="exerciseEntries.length > 0">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900">Exercise</h3>
              <span class="text-sm text-gray-500"
                >{{ exerciseEntries.length }} activities</span
              >
            </div>
            <div class="space-y-3">
              <Card
                v-for="entry in exerciseEntries"
                :key="entry.id"
                class="p-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div
                      class="flex items-center justify-center w-12 h-12 mr-3 bg-blue-100 rounded-lg"
                    >
                      <ActivityIcon class="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 class="font-medium">{{ entry.exercise_type }}</h4>
                      <div
                        class="flex items-center space-x-3 text-sm text-gray-600"
                      >
                        <span>{{ entry.exercise_duration }} min</span>
                        <span
                          >{{ Math.round(entry.calories_burned) }} cal
                          burned</span
                        >
                      </div>
                    </div>
                  </div>
                  <button
                    @click="deleteEntry(entry.id)"
                    class="p-2 text-red-500 rounded-full hover:bg-red-50"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import { debounce } from '@/utils/helpers';
const websiteUrlStorage = import.meta.env.VITE_WEBSITE_URL_STORAGE;
const websiteUrlImage = import.meta.env.VITE_WEBSITE_URL_IMAGE;

// Icons
const CalendarIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
};

const PlusIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>',
};

const SearchIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
};

const TrashIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>',
};

const BookOpenIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
};

const ActivityIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
};

// Stores & Router

const userStore = useUserStore();
const foodStore = useFoodStore();

// Reactive state
const loading = ref(false);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const showDatePicker = ref(false);
const tempSelectedDate = ref(new Date().toISOString().split('T')[0]);

const showAddEntry = ref(false);
const entryTab = ref('favorite'); // 'food' or 'recipe'
const newEntry = ref({
  date: new Date().toISOString().split('T')[0],
  meal_type: 'breakfast',
  favorite_id: null,
  food_id: null,
  quantity: 1,
  exercise_type: '',
  exercise_duration: '',
  calories_burned: '',
});

// Search states
const favoriteSearch = ref('');
const foodSearch = ref('');

// Computed properties
const diaryEntries = computed(() => {
  return userStore.diaryEntries || [];
});

const diaryByDate = computed(() => {
  return diaryEntries.value.filter(
    (entry) => entry.date === selectedDate.value
  );
});

const summary = computed(() => {
  const summaryData = userStore.dailySummary || {};

  return {
    date: summaryData.date || null,
    total_calories_intake: summaryData.total_calories_intake || 0,
    total_calories_burned: summaryData.total_calories_burned || 0,
    net_calories:
      summaryData.net_calories ||
      summaryData.total_calories_intake - summaryData.total_calories_burned ||
      0,
    calorie_progress:
      summaryData.calorie_progress ||
      (summaryData.target_calories > 0
        ? Math.round(
            ((summaryData.total_calories_intake || 0) /
              summaryData.target_calories) *
              100
          )
        : 0) ||
      0,
    total_protein: summaryData.total_protein || 0,
    total_carbs: summaryData.total_carbs || 0,
    total_fat: summaryData.total_fat || 0,
    total_fiber: summaryData.total_fiber || 0,
    target_calories: summaryData.target_calories || 2000,
    remaining_calories:
      summaryData.remaining_calories ||
      summaryData.target_calories - summaryData.total_calories_intake ||
      2000,
  };
});

const exerciseEntries = computed(() => {
  return diaryEntries.value.filter((entry) => entry.meal_type === 'exercise');
});

const formattedSelectedDate = computed(() => {
  const today = new Date();

  if (selectedDate.value === today.toISOString().split('T')[0]) return 'Today';

  return new Date(selectedDate.value).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const canSaveEntry = computed(() => {
  if (newEntry.value.meal_type === 'exercise') {
    return newEntry.value.exercise_type && newEntry.value.exercise_duration;
  } else {
    return (
      (newEntry.value.food_id || newEntry.value.favorite_id) &&
      newEntry.value.quantity > 0
    );
  }
});

const filteredFavorites = computed(() => {
  if (!favoriteSearch.value) return userStore.favorites.slice(0, 10);
  return userStore.favorites
    .filter(
      (favorite) =>
        favorite.name
          .toLowerCase()
          .includes(favoriteSearch.value.toLowerCase()) ||
        favorite.description
          ?.toLowerCase()
          .includes(favoriteSearch.value.toLowerCase())
    )
    .slice(0, 10);
});

const filteredFoods = computed(() => {
  if (!foodSearch.value) return foodStore.foods.slice(0, 10);
  return foodStore.foods
    .filter(
      (food) =>
        food.name.toLowerCase().includes(foodSearch.value.toLowerCase()) ||
        food.description?.toLowerCase().includes(foodSearch.value.toLowerCase())
    )
    .slice(0, 10);
});

// Methods
const openDatePicker = () => {
  tempSelectedDate.value = selectedDate.value;
  showDatePicker.value = true;
};

const confirmDateSelection = () => {
  selectedDate.value = tempSelectedDate.value;
  showDatePicker.value = false;
  newEntry.value.date = tempSelectedDate.value;
  fetchDiaryEntries();
};

const addEntry = () => {
  newEntry.value = {
    date: selectedDate.value,
    meal_type: 'breakfast',
    food_id: null,
    favorite_id: null,
    quantity: 1,
    exercise_type: '',
    exercise_duration: '',
    calories_burned: '',
  };
  showAddEntry.value = true;
};

const selectFavorite = (favorite) => {
  newEntry.value.favorite_id = favorite.id;
  newEntry.value.food_id = null;
};

const selectFood = (food) => {
  newEntry.value.food_id = food.id;
  newEntry.value.favorite_id = null;
};

// ✅ PERBAIKAN: Save entry ke database
const saveEntry = async () => {
  if (!canSaveEntry.value) {
    console.error('Cannot save entry - validation failed');
    return;
  }

  loading.value = true;
  try {
    // Prepare data untuk dikirim
    const entryData = { ...newEntry.value };

    // Hapus field yang tidak diperlukan berdasarkan meal_type
    if (entryData.meal_type === 'exercise') {
      delete entryData.food_id;
      delete entryData.quantity;
    } else {
      delete entryData.exercise_type;
      delete entryData.exercise_duration;
      delete entryData.calories_burned;
    }

    const result = await userStore.createDiaryEntry(entryData);

    if (result.success) {
      showAddEntry.value = false;

      // Reset form
      newEntry.value = {
        date: selectedDate.value,
        meal_type: 'breakfast',
        food_id: null,
        favorite_id: null,
        quantity: 1,
        exercise_type: '',
        exercise_duration: '',
        calories_burned: '',
      };

      // Refresh data
      await fetchDiaryEntries();
    } else {
      console.error('Failed to save entry:', result.error);
    }
  } catch (error) {
    console.error('Failed to save entry:', error);
  } finally {
    loading.value = false;
  }
};

// ✅ PERBAIKAN: Delete entry dari database
const deleteEntry = async (entryId) => {
  if (confirm('Are you sure you want to delete this entry?')) {
    loading.value = true;
    try {
      // ✅ PERBAIKAN: Delete entry dan refresh semua data
      const result = await userStore.deleteDiaryEntry(entryId);

      if (result.success) {
        // ✅ PERBAIKAN: Refresh entries dan summary setelah delete
        await Promise.all([
          fetchDiaryEntries(),
          userStore.fetchDailySummary(selectedDate.value),
        ]);
      } else {
        console.error('Failed to delete entry:', result.error);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    } finally {
      loading.value = false;
    }
  }
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
  } else if (entry.exercise_type) {
    return entry.exercise_type;
  }
  return 'Unknown Entry';
};

// ✅ PERBAIKAN: Fetch diary entries dari API
const fetchDiaryEntries = async () => {
  loading.value = true;
  try {
    await Promise.all([
      userStore.fetchDiaryEntries(selectedDate.value),
      userStore.fetchDailySummary(selectedDate.value),
      foodStore.fetchFoods(),
      foodStore.fetchRecipes(),
      userStore.fetchFavorites(),
    ]);
  } catch (error) {
    console.error('Failed to fetch diary entries:', error);
  } finally {
    loading.value = false;
  }
};

const debounceSearchFavorites = debounce(() => {
  if (favoriteSearch.value) {
    userStore.searchFavorites(favoriteSearch.value);
  }
});
const debounceSearchFoods = debounce(() => {
  if (foodSearch.value) {
    foodStore.searchFoods(foodSearch.value);
  }
}, 300);

const handleImageError = (event) => {
  event.target.src = websiteUrlImage + 'default-food.jpg';
};

const clearSearch = () => {
  searchQuery.value = '';
  fetchDiaryEntries();
};

const clearFilters = () => {
  filters.value = {
    difficulty: '',
    cooking_time: '',
    servings: '',
  };
  showFilters.value = false;
  fetchRecipes();
};

const clearAll = () => {
  searchQuery.value = '';
  clearFilters();
};

const loadMore = () => {
  page.value++;
  fetchRecipes();
};

// Lifecycle
onMounted(async () => {
  await fetchDiaryEntries();
});

// Watchers
watch(selectedDate, () => {
  fetchDiaryEntries();
});

watch(foodSearch, () => {
  debounceSearch();
});
</script>
