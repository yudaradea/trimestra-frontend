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
          <h1 class="text-xl font-bold text-primary">Preferences</h1>
          <button
            @click="savePreferences"
            :disabled="saving"
            class="font-medium text-primary hover:text-orange-600"
            :class="{ 'opacity-50 cursor-not-allowed': saving }"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner text="Loading preferences..." />
      </div>

      <!-- Preferences Form -->
      <div v-else>
        <form @submit.prevent="savePreferences" class="space-y-6">
          <!-- Diet Preferences -->
          <Card>
            <div class="p-6">
              <h2 class="mb-4 text-lg font-semibold text-gray-900">
                Diet Preferences
              </h2>

              <div class="space-y-4">
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Diet Type</label
                  >
                  <select v-model="form.diet_type" class="w-full select-field">
                    <option value="no_preference">No Preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="gluten-free">Gluten-Free</option>
                  </select>
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Allergies</label
                  >
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="form.allergies"
                        type="checkbox"
                        value="telur"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Telur</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.allergies"
                        type="checkbox"
                        value="susu"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Susu</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.allergies"
                        type="checkbox"
                        value="kacang-kacangan"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Kacang-kacangan</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.allergies"
                        type="checkbox"
                        value="ikan"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Ikan</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.allergies"
                        type="checkbox"
                        value="tidak ada"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Tidak ada</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Meal Preferences -->
          <Card>
            <div class="p-6">
              <h2 class="mb-4 text-lg font-semibold text-gray-900">
                Meal Preferences
              </h2>

              <div class="space-y-4">
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Preferred Meal Times</label
                  >
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="form.preferred_meal_times"
                        type="checkbox"
                        value="breakfast"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Breakfast</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.preferred_meal_times"
                        type="checkbox"
                        value="lunch"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Lunch</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.preferred_meal_times"
                        type="checkbox"
                        value="dinner"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Dinner</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.preferred_meal_times"
                        type="checkbox"
                        value="snack"
                        class="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span class="ml-2 text-gray-700">Snack</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Calorie Target</label
                  >
                  <select
                    v-model="form.calorie_target"
                    class="w-full select-field"
                  >
                    <option value="not_sure">Not sure</option>
                    <option value="<1500">Less than 1500 calories</option>
                    <option value="1500-2000">1500-2000 calories</option>
                    <option value=">2000">More than 2000 calories</option>
                  </select>
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Cooking Time Preference</label
                  >
                  <select
                    v-model="form.cooking_time_preference"
                    class="w-full select-field"
                  >
                    <option value="not_sure">Not sure</option>
                    <option value="<15">Less than 15 minutes</option>
                    <option value="15-30">15-30 minutes</option>
                    <option value=">30">More than 30 minutes</option>
                  </select>
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Serving Preference</label
                  >
                  <select
                    v-model="form.serving_preference"
                    class="w-full select-field"
                  >
                    <option value="3">3 servings</option>
                    <option value="4">4 servings</option>
                    <option value="5">5 servings</option>
                    <option value=">5">More than 5 servings</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <Button @click="goBack" variant="outline" class="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              :loading="saving"
              :loading-text="'Saving...'"
              class="flex-1 btn-primary"
            >
              Save Preferences
            </Button>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-sm text-center text-red-500">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

// Icons
const ArrowLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
};

// Stores & Router
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Reactive state
const loading = ref(false);
const saving = ref(false);
const error = ref('');

const form = ref({
  diet_type: 'no_preference',
  allergies: ['tidak ada'],
  preferred_meal_times: ['breakfast'],
  calorie_target: 'not_sure',
  cooking_time_preference: 'not_sure',
  serving_preference: '3',
});

// Methods
const goBack = () => {
  router.back();
};

const savePreferences = async () => {
  saving.value = true;
  error.value = '';

  try {
    const result = await userStore.updatePreferences(form.value);

    if (result.success) {
      router.push('/profile');
    } else {
      error.value = result.error;
    }
  } catch (err) {
    error.value = 'Failed to save preferences';
    console.error('Save preferences error:', err);
  } finally {
    saving.value = false;
  }
};

const fetchPreferences = async () => {
  loading.value = true;
  try {
    await userStore.fetchPreferences();

    // Populate form with existing preferences
    const preferences = userStore.preferences;
    if (preferences) {
      form.value = { ...preferences };
    }
  } catch (err) {
    error.value = 'Failed to load preferences';
    console.error('Fetch preferences error:', err);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchPreferences();
});
</script>
