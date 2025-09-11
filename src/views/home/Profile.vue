<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-primary">My Profile</h1>
          <div class="flex items-center space-x-3">
            <button
              @click="editProfile"
              class="flex items-center text-primary hover:text-orange-600"
            >
              <EditIcon class="w-5 h-5 mr-1" />
              <span class="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner text="Loading profile..." />
      </div>

      <!-- Profile Content -->
      <div v-else>
        <!-- Profile Header -->
        <Card class="mb-6">
          <div class="p-6">
            <div class="flex flex-col items-center sm:flex-row">
              <div class="relative mb-4 sm:mb-0 sm:mr-6">
                <img
                  :src="profilePhoto"
                  :alt="user?.name"
                  class="object-cover w-24 h-24 border-4 border-white rounded-full shadow-lg"
                  @error="handleProfileImageError"
                />
                <div
                  @click="editProfile"
                  class="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer bg-primary"
                >
                  <CameraIcon class="w-4 h-4 text-white" />
                </div>
              </div>

              <div class="text-center sm:text-left">
                <h2 class="mb-1 text-2xl font-bold text-gray-900">
                  {{ user?.name }}
                </h2>
                <p class="mb-2 text-gray-600">{{ user?.email }}</p>
                <p class="text-sm text-gray-500">{{ user?.phone }}</p>

                <div
                  class="flex flex-wrap justify-center gap-2 mt-3 sm:justify-start"
                >
                  <span class="badge-primary"
                    >Member since {{ memberSince }}</span
                  >
                  <span
                    :class="[
                      'badge',
                      user?.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800',
                    ]"
                  >
                    {{ user?.role === 'admin' ? 'Admin' : 'User' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Profile Sections -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Personal Information -->
          <Card>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <button
                  @click="editProfile"
                  class="text-primary hover:text-orange-600"
                >
                  <EditIcon class="w-5 h-5" />
                </button>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Birth Date</span>
                  <span class="font-medium">{{ formattedBirthDate }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Age</span>
                  <span class="font-medium">{{ age }} years</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Height</span>
                  <span class="font-medium">{{ profile?.height }} cm</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Weight</span>
                  <span class="font-medium">{{ profile?.weight }} kg</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">BMI</span>
                  <span class="font-medium">{{ bmi }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Target Calories</span>
                  <span class="font-medium">{{
                    profile?.target_calories
                  }}</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Pregnancy Status -->
          <Card>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  Pregnancy Status
                </h3>
                <button
                  @click="editProfile"
                  class="text-primary hover:text-orange-600"
                >
                  <EditIcon class="w-5 h-5" />
                </button>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Status</span>
                  <span
                    :class="[
                      'font-medium',
                      profile?.is_pregnant ? 'text-green-600' : 'text-gray-600',
                    ]"
                  >
                    {{ profile?.is_pregnant ? 'Pregnant' : 'Not Pregnant' }}
                  </span>
                </div>

                <div v-if="profile?.is_pregnant" class="space-y-4">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Weeks</span>
                    <span class="font-medium"
                      >{{ profile?.pregnancy_weeks }} weeks</span
                    >
                  </div>

                  <div class="flex justify-between">
                    <span class="text-gray-600">First Pregnancy</span>
                    <span class="font-medium">
                      {{ profile?.is_first_pregnancy ? 'Yes' : 'No' }}
                    </span>
                  </div>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Diet Preference</span>
                  <span class="font-medium capitalize">
                    {{ profile?.diet_preference || 'Normal' }}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Health Goals -->
          <Card>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  Health Goals
                </h3>
                <button
                  @click="editPreferences"
                  class="text-primary hover:text-orange-600"
                >
                  <EditIcon class="w-5 h-5" />
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="goal in healthGoals"
                  :key="goal"
                  class="flex items-center"
                >
                  <CheckCircleIcon class="w-5 h-5 mr-3 text-green-500" />
                  <span class="text-gray-700">{{ formatGoal(goal) }}</span>
                </div>

                <div
                  v-if="healthGoals.length === 0"
                  class="italic text-gray-500"
                >
                  No health goals set
                </div>
              </div>
            </div>
          </Card>

          <!-- Preferences -->
          <Card>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Preferences</h3>
                <button
                  @click="editPreferences"
                  class="text-primary hover:text-orange-600"
                >
                  <EditIcon class="w-5 h-5" />
                </button>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Diet Type</span>
                  <span class="font-medium capitalize">
                    {{
                      preferences?.diet_type?.replace('-', ' ') ||
                      'No Preference'
                    }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Calorie Target</span>
                  <span class="font-medium">
                    {{ preferences?.calorie_target || 'Not Set' }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Cooking Time</span>
                  <span class="font-medium">
                    {{ preferences?.cooking_time_preference || 'Any' }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Servings</span>
                  <span class="font-medium">
                    {{ preferences?.serving_preference || '3' }}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Quick Actions -->
        <div class="mt-6">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button
              @click="editProfile"
              class="p-4 text-center transition-shadow card hover:shadow-lg"
            >
              <UserIcon class="w-8 h-8 mx-auto mb-2 text-primary" />
              <span class="text-sm font-medium">Edit Profile</span>
            </button>

            <button
              @click="editPreferences"
              class="p-4 text-center transition-shadow card hover:shadow-lg"
            >
              <CogIcon class="w-8 h-8 mx-auto mb-2 text-primary" />
              <span class="text-sm font-medium">Preferences</span>
            </button>

            <button
              @click="goTo('/profile/settings')"
              class="p-4 text-center transition-shadow card hover:shadow-lg"
            >
              <SettingsIcon class="w-8 h-8 mx-auto mb-2 text-primary" />
              <span class="text-sm font-medium">Settings</span>
            </button>

            <button
              @click="logout"
              class="p-4 text-center transition-shadow card hover:shadow-lg"
            >
              <LogoutIcon class="w-8 h-8 mx-auto mb-2 text-red-500" />
              <span class="text-sm font-medium text-red-600">Logout</span>
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
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

// Icons
const EditIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>',
};

const CameraIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
};

const CheckCircleIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

const UserIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
};

const CogIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
};

const SettingsIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
};

const LogoutIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>',
};

// Stores & Router
const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

// Reactive state
const loading = ref(false);

// Computed properties
const user = computed(() => authStore.user);
const profile = computed(() => userStore.profile);
const preferences = computed(() => userStore.preferences);

const profilePhoto = computed(() => {
  if (user.value?.profile_photo) {
    return user.value.profile_photo;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.value?.name || 'U'
  )}&color=7F9CF5&background=EBF4FF`;
});

const memberSince = computed(() => {
  if (user.value?.created_at) {
    return new Date(user.value.created_at).getFullYear();
  }
  return 'N/A';
});

const formattedBirthDate = computed(() => {
  if (profile.value?.birth_date) {
    return new Date(profile.value.birth_date).toLocaleDateString();
  }
  return 'Not set';
});

const age = computed(() => {
  if (profile.value?.birth_date) {
    const birthDate = new Date(profile.value.birth_date);
    const today = new Date();
    const diff = today.getFullYear() - birthDate.getFullYear();
    return diff;
  }
  return 'N/A';
});

const bmi = computed(() => {
  if (profile.value?.height && profile.value?.weight) {
    const heightInMeters = profile.value.height / 100;
    const bmiValue = profile.value.weight / (heightInMeters * heightInMeters);
    return bmiValue.toFixed(1);
  }
  return 'N/A';
});

const healthGoals = computed(() => {
  if (
    profile.value?.health_goals &&
    Array.isArray(profile.value.health_goals)
  ) {
    return profile.value.health_goals;
  }
  return [];
});

// Methods
const formatGoal = (goal) => {
  const goalMap = {
    menjaga_berat_makan: 'Maintain Eating Weight',
    menaikan_berat_badan: 'Gain Weight',
    menambah_energi: 'Add Energy',
    menjaga_kehamilan_sehat: 'Maintain Healthy Pregnancy',
  };
  return (
    goalMap[goal] ||
    goal.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const editProfile = () => {
  router.push('/profile/edit');
};

const editPreferences = () => {
  router.push('/profile/preferences');
};

const logout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout();
    router.push('/login');
  }
};

const handleProfileImageError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.value?.name || 'U'
  )}&color=7F9CF5&background=EBF4FF`;
};

// Lifecycle
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      authStore.fetchUser(),
      userStore.fetchProfile(),
      userStore.fetchPreferences(),
    ]);
  } catch (error) {
    console.error('Failed to load profile data:', error);
  } finally {
    loading.value = false;
  }
});
</script>
