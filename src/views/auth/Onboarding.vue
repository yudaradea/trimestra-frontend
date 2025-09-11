<template>
  <div class="min-h-screen bg-background">
    <!-- Progress Bar -->
    <div class="h-1 bg-gray-200">
      <div
        class="h-full transition-all duration-300 bg-primary"
        :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
      ></div>
    </div>

    <div class="container px-4 py-8 mx-auto">
      <div class="max-w-2xl mx-auto">
        <!-- Step 1: Welcome -->
        <div v-if="currentStep === 1" class="py-12 text-center">
          <div
            class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-primary"
          >
            <span class="text-3xl font-bold text-white">T</span>
          </div>
          <h1 class="mb-4 text-3xl font-bold text-gray-900">
            Welcome to TRIMESTRA
          </h1>
          <p class="mb-8 text-gray-600">
            Let's get started with setting up your profile for a better
            personalized experience.
          </p>
          <Button @click="nextStep" class="w-full max-w-xs">
            Get Started
          </Button>
        </div>

        <!-- Step 2: Personal Information -->
        <div v-else-if="currentStep === 2" class="py-8">
          <h2 class="mb-2 text-2xl font-bold text-gray-900">
            Personal Information
          </h2>
          <p class="mb-8 text-gray-600">Tell us about yourself</p>

          <form @submit.prevent="nextStep" class="space-y-6">
            <Input
              v-model="profile.birth_date"
              label="Birth Date"
              type="date"
              required
              :error="profileErrors.birth_date"
            />

            <div class="grid grid-cols-2 gap-4">
              <Input
                v-model="profile.height"
                label="Height (cm)"
                type="number"
                required
                :error="profileErrors.height"
                step="0.1"
              />
              <Input
                v-model="profile.weight"
                label="Weight (kg)"
                type="number"
                required
                :error="profileErrors.weight"
                step="0.1"
              />
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Are you pregnant?</label
              >
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="profile.is_pregnant"
                    type="radio"
                    :value="true"
                    class="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="profile.is_pregnant"
                    type="radio"
                    :value="false"
                    class="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div v-if="profile.is_pregnant" class="space-y-4">
              <Input
                v-model.number="profile.pregnancy_weeks"
                label="Pregnancy Weeks"
                type="number"
                required
                :error="profileErrors.pregnancy_weeks"
                min="1"
                max="40"
              />

              <div class="space-y-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Is this your first pregnancy?</label
                >
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input
                      v-model="profile.is_first_pregnancy"
                      type="radio"
                      :value="true"
                      class="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span class="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="profile.is_first_pregnancy"
                      type="radio"
                      :value="false"
                      class="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span class="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Diet Preference</label
              >
              <select v-model="profile.diet_preference" class="select-field">
                <option value="normal">Normal</option>
                <option value="vegetarian">Vegetarian</option>
              </select>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Health Goals</label
              >
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="profile.health_goals"
                    type="checkbox"
                    value="menjaga_berat_makan"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Menjaga berat makan</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="profile.health_goals"
                    type="checkbox"
                    value="menaikan_berat_badan"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Menaikan berat badan</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="profile.health_goals"
                    type="checkbox"
                    value="menambah_energi"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Menambah energi</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="profile.health_goals"
                    type="checkbox"
                    value="menjaga_kehamilan_sehat"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700"
                    >Menjaga kehamilan sehat</span
                  >
                </label>
              </div>
            </div>

            <div class="flex justify-between pt-6">
              <Button @click="prevStep" variant="outline"> Back </Button>
              <Button type="submit"> Next </Button>
            </div>
          </form>
        </div>

        <!-- Step 3: Food Preferences -->
        <div v-else-if="currentStep === 3" class="py-8">
          <h2 class="mb-2 text-2xl font-bold text-gray-900">
            Food Preferences
          </h2>
          <p class="mb-8 text-gray-600">Tell us about your food preferences</p>

          <form @submit.prevent="nextStep" class="space-y-6">
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Diet Type</label
              >
              <select v-model="preferences.diet_type" class="select-field">
                <option value="no_preference">No Preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto">Keto</option>
                <option value="vegan">Vegan</option>
                <option value="paleo">Paleo</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Allergies</label
              >
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="preferences.allergies"
                    type="checkbox"
                    value="telur"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Telur</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="preferences.allergies"
                    type="checkbox"
                    value="susu"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Susu</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="preferences.allergies"
                    type="checkbox"
                    value="kacang-kacangan"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Kacang-kacangan</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="preferences.allergies"
                    type="checkbox"
                    value="ikan"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Ikan</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="preferences.allergies"
                    type="checkbox"
                    value="tidak ada"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Tidak ada</span>
                </label>
              </div>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Preferred Meal Times</label
              >
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="preferences.preferred_meal_times"
                    type="checkbox"
                    value="breakfast"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Breakfast</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="preferences.preferred_meal_times"
                    type="checkbox"
                    value="lunch"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Lunch</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="preferences.preferred_meal_times"
                    type="checkbox"
                    value="dinner"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Dinner</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="preferences.preferred_meal_times"
                    type="checkbox"
                    value="snack"
                    class="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-700">Snack</span>
                </label>
              </div>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Calorie Target</label
              >
              <select v-model="preferences.calorie_target" class="select-field">
                <option value="<1500">< 1500 calories</option>
                <option value="1500-2000">1500-2000 calories</option>
                <option value=">2000">> 2000 calories</option>
                <option value="not_sure">Not sure</option>
              </select>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Cooking Time Preference</label
              >
              <select
                v-model="preferences.cooking_time_preference"
                class="select-field"
              >
                <option value="<15">< 15 minutes</option>
                <option value="15-30">15-30 minutes</option>
                <option value=">30">> 30 minutes</option>
                <option value="not_sure">Not sure</option>
              </select>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700"
                >Serving Preference</label
              >
              <select
                v-model="preferences.serving_preference"
                class="select-field"
              >
                <option value="3">3 servings</option>
                <option value="4">4 servings</option>
                <option value="5">5 servings</option>
                <option value=">5">> 5 servings</option>
              </select>
            </div>

            <div class="flex justify-between pt-6">
              <Button @click="prevStep" variant="outline"> Back </Button>
              <Button type="submit"> Next </Button>
            </div>
          </form>
        </div>

        <!-- Step 4: Device Connection -->
        <div v-else-if="currentStep === 4" class="py-8 text-center">
          <div
            class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-primary"
          >
            <DeviceIcon class="w-12 h-12 text-white" />
          </div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900">
            Connect Your Device
          </h2>
          <p class="mb-8 text-gray-600">
            Connect your smart device to track your activity and sync exercise
            data automatically.
          </p>

          <div class="space-y-6">
            <div class="p-6 rounded-lg bg-gray-50">
              <h3 class="mb-2 font-medium text-gray-900">How to Connect</h3>
              <ol class="space-y-2 text-sm text-left text-gray-600">
                <li>1. Open the TRIMESTRA app on your smart device</li>
                <li>2. Go to Settings > Device Connection</li>
                <li>3. Scan the QR code below or enter the pairing code</li>
              </ol>
            </div>

            <div
              class="p-8 bg-white border-2 border-gray-300 border-dashed rounded-lg"
            >
              <div
                class="flex items-center justify-center w-32 h-32 mx-auto mb-4 bg-gray-200 rounded"
              >
                <QRCodeIcon class="w-16 h-16 text-gray-400" />
              </div>
              <p class="text-gray-500">QR Code will appear here</p>
            </div>

            <div class="flex justify-between pt-6">
              <Button @click="prevStep" variant="outline"> Back </Button>
              <Button @click="completeOnboarding"> Skip for Now </Button>
            </div>
          </div>
        </div>

        <!-- Completed -->
        <div v-else class="py-12 text-center">
          <div
            class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full"
          >
            <CheckIcon class="w-12 h-12 text-green-600" />
          </div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900">Setup Complete!</h2>
          <p class="mb-8 text-gray-600">
            Congratulations! Your profile is ready. Let's start your journey
            with TRIMESTRA.
          </p>
          <Button @click="goToHome"> Get Started </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

// Icons
const DeviceIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
};

const QRCodeIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1V8zm0 8h2a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1z" /></svg>',
};

const CheckIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
};

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const currentStep = ref(1);
const loading = ref(false);
const totalSteps = 4; // Total steps in the onboarding process

const profile = reactive({
  birth_date: '',
  height: '',
  weight: '',
  is_pregnant: false,
  pregnancy_weeks: '',
  is_first_pregnancy: false,
  diet_preference: 'normal',
  health_goals: [],
});

const preferences = reactive({
  diet_type: 'no_preference',
  allergies: ['tidak ada'],
  preferred_meal_times: ['breakfast', 'lunch'],
  calorie_target: '1500-2000',
  cooking_time_preference: '15-30',
  serving_preference: '3',
});

const profileErrors = reactive({
  birth_date: '',
  height: '',
  weight: '',
  pregnancy_weeks: '',
});

onMounted(async () => {
  try {
    const progress = await userStore.fetchOnboardingProgress();
    if (progress) {
      currentStep.value = progress.current_step;

      // Jika sudah selesai step 3, redirect ke home
      if (progress.current_step >= 3) {
        router.push('/');
        return;
      }
    }
  } catch (error) {
    console.error('Failed to load onboarding progress:', error);
  }
});

const nextStep = async () => {
  if (currentStep.value === 2) {
    // Validate personal info
    if (!validateProfile()) return;
    await saveProfile();
  } else if (currentStep.value === 3) {
    // Validate preferences
    await savePreferences();
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const validateProfile = () => {
  let isValid = true;

  if (!profile.birth_date) {
    profileErrors.birth_date = 'Birth date is required';
    isValid = false;
  }

  if (!profile.height) {
    profileErrors.height = 'Height is required';
    isValid = false;
  }

  if (!profile.weight) {
    profileErrors.weight = 'Weight is required';
    isValid = false;
  }

  if (profile.is_pregnant) {
    if (!profile.pregnancy_weeks) {
      profileErrors.pregnancy_weeks = 'Pregnancy weeks is required';
      isValid = false;
    }
  }

  return isValid;
};

const saveProfile = async () => {
  try {
    await userStore.updateProfile(profile);
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
};

const savePreferences = async () => {
  try {
    await userStore.updatePreferences(preferences);
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

// Update method completeOnboarding untuk step 3
const completeOnboarding = async () => {
  loading.value = true;
  try {
    // Update progress to step 3
    const result = await userStore.updateOnboardingProgress({
      current_step: 3,
      completed: 1, // Belum benar-benar completed karena belum device
    });

    if (result.success) {
      // Redirect to home - user bisa akses aplikasi
      router.push('/');
    }
  } catch (error) {
    console.error('Failed to complete onboarding:', error);
  } finally {
    loading.value = false;
  }
};

const skipDevice = async () => {
  // Mark onboarding as completed without device
  const result = await userStore.updateOnboardingProgress({
    current_step: 3,
    completed: true, // Sekarang completed
  });

  if (result.success) {
    router.push('/');
  }
};

const connectDevice = () => {
  // Logic untuk device connection
  router.push('/device-connect');
};
const goToHome = () => {
  router.push('/');
};
</script>
