<!-- src/views/profile/EditProfile.vue -->
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
          <h1 class="text-xl font-bold text-primary">Edit Profile</h1>
          <button
            @click="saveProfile"
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
        <LoadingSpinner text="Loading profile..." />
      </div>

      <!-- Profile Form -->
      <div v-else>
        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- Profile Photo -->
          <Card>
            <div class="p-6">
              <h2 class="mb-4 text-lg font-semibold text-gray-900">
                Profile Photo
              </h2>
              <div class="flex items-center">
                <div class="relative">
                  <img
                    :src="profilePhotoPreview"
                    :alt="form.name"
                    class="object-cover w-24 h-24 border-4 border-white rounded-full shadow-lg"
                    @error="handleProfileImageError"
                  />
                  <label
                    for="profile-photo"
                    class="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer bg-primary"
                  >
                    <CameraIcon class="w-4 h-4 text-white" />
                  </label>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handlePhotoChange"
                  />
                </div>
                <div class="ml-6">
                  <h3 class="font-medium text-gray-900">{{ form.name }}</h3>
                  <p class="text-sm text-gray-600">{{ form.email }}</p>
                  <button
                    v-if="hasPhotoChanged"
                    @click="removePhoto"
                    type="button"
                    class="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <!-- Personal Information -->
          <Card>
            <div class="p-6">
              <h2 class="mb-4 text-lg font-semibold text-gray-900">
                Personal Information
              </h2>

              <div class="space-y-4">
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Full Name</label
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Email Address</label
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full input-field"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Phone Number</label
                  >
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </Card>

          <!-- Additional Information -->
          <Card>
            <div class="p-6">
              <h2 class="mb-4 text-lg font-semibold text-gray-900">
                Additional Information
              </h2>

              <div class="space-y-4">
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700"
                    >Birth Date</label
                  >
                  <input
                    v-model="form.birth_date"
                    type="date"
                    class="w-full input-field"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Height (cm)</label
                    >
                    <input
                      v-model.number="form.height"
                      type="number"
                      class="w-full input-field"
                      placeholder="e.g., 165"
                    />
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Weight (kg)</label
                    >
                    <input
                      v-model.number="form.weight"
                      type="number"
                      class="w-full input-field"
                      placeholder="e.g., 60"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Diet Preference</label
                    >
                    <select
                      v-model="form.diet_preference"
                      class="w-full select-field"
                    >
                      <option value="normal">Normal</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                      <option value="gluten-free">Gluten-Free</option>
                    </select>
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Target Calories (per day)</label
                    >
                    <input
                      v-model.number="form.target_calories"
                      type="number"
                      min="800"
                      max="5000"
                      class="w-full input-field"
                      placeholder="e.g., 2000"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Health Goals</label
                    >
                    <div class="space-y-2">
                      <label class="flex items-center">
                        <input
                          v-model="form.health_goals"
                          type="checkbox"
                          value="menjaga_berat_makan"
                          class="w-4 h-4 rounded text-primary focus:ring-primary"
                        />
                        <span class="ml-2 text-gray-700"
                          >Menjaga berat makan</span
                        >
                      </label>
                      <label class="flex items-center">
                        <input
                          v-model="form.health_goals"
                          type="checkbox"
                          value="menaikan_berat_badan"
                          class="w-4 h-4 rounded text-primary focus:ring-primary"
                        />
                        <span class="ml-2 text-gray-700"
                          >Menaikan berat badan</span
                        >
                      </label>
                      <label class="flex items-center">
                        <input
                          v-model="form.health_goals"
                          type="checkbox"
                          value="menambah_energi"
                          class="w-4 h-4 rounded text-primary focus:ring-primary"
                        />
                        <span class="ml-2 text-gray-700">Menambah energi</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          v-model="form.health_goals"
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

                  <div class="order-first">
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Pregnancy Status</label
                    >
                    <div class="space-y-3">
                      <label class="flex items-center">
                        <input
                          v-model="form.is_pregnant"
                          type="radio"
                          :value="true"
                          class="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span class="ml-2 text-gray-700">I'm pregnant</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          v-model="form.is_pregnant"
                          type="radio"
                          :value="false"
                          class="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span class="ml-2 text-gray-700">I'm not pregnant</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  v-if="form.is_pregnant"
                  class="pl-6 space-y-4 border-l-2 border-gray-200"
                >
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >Pregnancy Weeks</label
                    >
                    <input
                      v-model.number="form.pregnancy_weeks"
                      type="number"
                      min="1"
                      max="40"
                      class="w-full input-field"
                      placeholder="e.g., 20"
                    />
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700"
                      >First Pregnancy</label
                    >
                    <div class="space-y-2">
                      <label class="flex items-center">
                        <input
                          v-model="form.is_first_pregnancy"
                          type="radio"
                          :value="true"
                          class="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span class="ml-2 text-gray-700"
                          >Yes, this is my first pregnancy</span
                        >
                      </label>
                      <label class="flex items-center">
                        <input
                          v-model="form.is_first_pregnancy"
                          type="radio"
                          :value="false"
                          class="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span class="ml-2 text-gray-700"
                          >No, I've been pregnant before</span
                        >
                      </label>
                    </div>
                  </div>
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
              Save Changes
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

// Icons
const ArrowLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
};

const CameraIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>',
};

// Stores & Router
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();

// Reactive state
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const profilePhoto = ref(null);
const hasPhotoChanged = ref(false);
const profilePhotoFile = ref(null);

const form = ref({
  name: '',
  email: '',
  phone: '',
  birth_date: '',
  height: '',
  weight: '',
  is_pregnant: false,
  pregnancy_weeks: '',
  is_first_pregnancy: false,
  diet_preference: 'normal',
  target_calories: null,
  health_goals: [],
});

// Computed properties
const profilePhotoPreview = computed(() => {
  if (profilePhoto.value) {
    // Jika ada foto baru yang dipilih
    return profilePhoto.value;
  }

  const user = authStore.user;
  if (user?.profile_photo) {
    // Jika user sudah punya foto profile
    return user.profile_photo;
  }

  // Default avatar
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'U'
  )}&color=7F9CF5&background=EBF4FF`;
});

const user = computed(() => authStore.user);

// Methods
const goBack = () => {
  router.back();
};

const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    profilePhotoFile.value = file; // Simpan file asli
    profilePhoto.value = URL.createObjectURL(file); // Untuk preview
    hasPhotoChanged.value = true;
  }
};

const removePhoto = () => {
  profilePhoto.value = null;
  profilePhotoFile.value = null;
  hasPhotoChanged.value = false;
  // Reset file input
  const fileInput = document.getElementById('profile-photo');
  if (fileInput) {
    fileInput.value = '';
  }
};

const handleProfileImageError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.value?.name || 'U'
  )}&color=7F9CF5&background=EBF4FF`;
};

const saveProfile = async () => {
  saving.value = true;
  error.value = '';

  try {
    // Save user data (name, email, phone)
    const userData = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
    };

    if (hasPhotoChanged.value && profilePhotoFile.value) {
      userData.profile_photo = profilePhotoFile.value;
    }

    const userResult = await authStore.updateUser(userData);

    if (!userResult.success) {
      error.value = userResult.error;
      saving.value = false;
      return;
    }

    // Save profile data (birth_date, height, weight, etc)
    const profileData = {
      birth_date: form.value.birth_date,
      height: form.value.height,
      weight: form.value.weight,
      is_pregnant: form.value.is_pregnant,
      pregnancy_weeks: form.value.pregnancy_weeks,
      is_first_pregnancy: form.value.is_first_pregnancy,
      diet_preference: form.value.diet_preference,
      target_calories: form.value.target_calories,
      health_goals: form.value.health_goals,
    };

    const profileResult = await userStore.updateProfile(profileData);

    if (!profileResult.success) {
      error.value = profileResult.error;
      saving.value = false;
      return;
    }

    // Handle photo upload if changed
    if (hasPhotoChanged.value && profilePhoto.value) {
      // Upload photo logic here (jika diperlukan)
      // console.log('Uploading photo:', profilePhoto.value);
    }

    // ✅ AUTO-SYNC TARGET CALORIES TO DAILY SUMMARY
    await userStore.syncTargetCalories();

    router.push('/profile');
  } catch (err) {
    error.value = 'Failed to save profile';
    console.error('Save profile error:', err);
  } finally {
    saving.value = false;
  }
};

const fetchProfile = async () => {
  loading.value = true;
  try {
    await Promise.all([
      authStore.fetchUser(),
      userStore.fetchProfile(),
      userStore.fetchPreferences(),
    ]);

    // Populate form with existing data
    const user = authStore.user;
    const profile = userStore.profile;
    const preferences = userStore.preferences;

    if (user) {
      form.value.name = user.name;
      form.value.email = user.email;
      form.value.phone = user.phone;
    }

    if (profile) {
      form.value.birth_date = profile.birth_date
        ? profile.birth_date.split('T')[0]
        : '';
      form.value.height = profile.height || '';
      form.value.weight = profile.weight || '';
      form.value.is_pregnant = profile.is_pregnant || false;
      form.value.pregnancy_weeks = profile.pregnancy_weeks || '';
      form.value.is_first_pregnancy = profile.is_first_pregnancy || false;
      form.value.diet_preference = profile.diet_preference || 'normal';
      form.value.target_calories = profile.target_calories || '';
      form.value.health_goals = profile.health_goals || [];
    }

    if (preferences) {
      // Merge preferences with profile if needed

      form.value.health_goals =
        preferences.health_goals || form.value.health_goals;
    }
  } catch (err) {
    error.value = 'Failed to load profile';
    console.error('Fetch profile error:', err);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchProfile();
});
</script>
