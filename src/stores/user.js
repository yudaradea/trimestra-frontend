import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import { data } from 'autoprefixer';

export const useUserStore = defineStore('user', () => {
  const profile = ref(null);
  const preferences = ref(null);
  const favorites = ref([]);
  const diaryEntries = ref([]);
  const onboardingProgress = ref(null);
  const deviceConnected = ref(false);
  const dailySummary = ref(null);
  const recentDiaryEntries = ref([]);
  const exerciseRecords = ref([]);
  const user = ref(null); // ✅ TAMBAHKAN INI

  // ✅ TAMBAHKAN: Fetch User Data Lengkap
  const fetchUser = async () => {
    try {
      const response = await api.get('/user');
      user.value = response.data.data;

      // Update device connection status
      deviceConnected.value = user.value.device_connected || false;

      return user.value;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  };

  // ✅ TAMBAHKAN: Update User Data
  const updateUser = async (userData) => {
    try {
      const response = await api.put('/user', userData);
      user.value = response.data.data;

      // Update device connection status jika ada perubahan
      if (userData.device_connected !== undefined) {
        deviceConnected.value = userData.device_connected;
      }

      return { success: true, data: user.value };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user',
      };
    }
  };

  // ✅ TAMBAHKAN: Delete User
  const deleteUser = async () => {
    try {
      await api.delete('/user');
      user.value = null;
      deviceConnected.value = false;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user',
      };
    }
  };

  // Fetch onboarding progress
  const fetchOnboardingProgress = async () => {
    try {
      const response = await api.get('/onboarding/progress');
      onboardingProgress.value = response.data.data;

      // Cek device connection status
      if (response.data.data.completed) {
        await checkDeviceConnection();
      }

      return onboardingProgress.value;
    } catch (error) {
      console.error('Failed to fetch onboarding progress:', error);
      return null;
    }
  };

  // Update onboarding progress
  const updateOnboardingProgress = async (progressData) => {
    try {
      const response = await api.post('/onboarding/progress', progressData);
      onboardingProgress.value = response.data.data;

      // Jika sudah step 3, cek device
      if (response.data.data.current_step >= 3) {
        await checkDeviceConnection();
      }

      return { success: true, data: onboardingProgress.value };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Failed to update onboarding progress',
      };
    }
  };

  // Check device connection status
  const checkDeviceConnection = async () => {
    try {
      // ✅ PERBAIKAN: Gunakan fetchUser yang sudah ada
      const userData = await fetchUser();
      if (userData) {
        deviceConnected.value = userData.device_connected || false;
      }
      return deviceConnected.value;
    } catch (error) {
      console.error('Failed to check device connection:', error);
      deviceConnected.value = false;
      return false;
    }
  };

  // ✅ PERBAIKAN: Check if device needs to be connected
  const needsDeviceConnection = computed(() => {
    // Cek apakah user sudah selesai onboarding
    if (checkDeviceConnection.value === true) {
      return false;
    }

    // Cek apakah device belum terhubung
    return !deviceConnected.value;
  });

  // ✅ TAMBAHKAN: Method untuk sync target calories
  const syncTargetCalories = async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await api.post('/diary/sync-target-calories', params);
      dailySummary.value = response.data.data;
      return { success: true, data: dailySummary.value };
    } catch (error) {
      console.error('Failed to sync target calories:', error);
      return {
        success: false,
        error:
          error.response?.data?.message || 'Failed to sync target calories',
      };
    }
  };

  // ✅ TAMBAHKAN: Get user target calories
  const getUserTargetCalories = (user) => {
    // Use target from profile if available
    if (user?.profile?.target_calories) {
      return user.profile.target_calories;
    }

    // Fallback to preferences
    if (user?.preferences?.calorie_target) {
      switch (user.preferences.calorie_target) {
        case '<1500':
          return 1200;
        case '1500-2000':
          return 1800;
        case '>2000':
          return 2500;
        default:
          return 2000;
      }
    }

    return 2000;
  };

  // ✅ TAMBAHKAN: Fetch daily summary
  const fetchDailySummary = async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await api.get('/diary/summary', { params });
      dailySummary.value = response.data.data;
      return dailySummary.value;
    } catch (error) {
      console.error('Failed to fetch daily summary:', error);

      // Create default summary with current target
      const user = authStore.user;
      const targetCalories = this.getUserTargetCalories(user);

      dailySummary.value = {
        total_calories_intake: 0,
        total_calories_burned: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        total_fiber: 0,
        target_calories: targetCalories,
        date: date || new Date().toISOString().split('T')[0],
      };

      return dailySummary.value;
    }
  };

  // ✅ TAMBAHKAN: Fetch recent diary entries
  const fetchRecentDiaryEntries = async (limit = 10) => {
    try {
      const response = await api.get('/diary', {
        params: { limit },
      });
      recentDiaryEntries.value =
        response.data.data.entries || response.data.data || [];
      return recentDiaryEntries.value;
    } catch (error) {
      console.error('Failed to fetch recent diary entries:', error);
      recentDiaryEntries.value = [];
      return [];
    }
  };

  // ✅ TAMBAHKAN: Fetch exercise records
  const fetchExerciseRecords = async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await api.get('/device/exercise-records', { params });
      exerciseRecords.value = response.data.data || [];
      return exerciseRecords.value;
    } catch (error) {
      console.error('Failed to fetch exercise records:', error);
      exerciseRecords.value = [];
      return [];
    }
  };

  // ✅ TAMBAHKAN: Update daily summary setelah entry baru
  const updateDailySummary = async (date) => {
    await fetchDailySummary(date);
    await fetchRecentDiaryEntries();
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      profile.value = response.data.data;
      return profile.value;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.post('/profile', profileData);
      profile.value = response.data.data;

      // ✅ UPDATE USER DATA JUGA JIKA ADA PERUBAHAN PROFILE
      // ✅ AUTO-SYNC TARGET CALORIES JIKA ADA PERUBAHAN TARGET
      if (profileData.target_calories) {
        await syncTargetCalories();
      }

      if (user.value) {
        user.value.profile = profile.value;
      }

      return { success: true, data: profile.value };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await api.get('/preferences');
      preferences.value = response.data.data;
      return preferences.value;
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      return null;
    }
  };

  const updatePreferences = async (preferencesData) => {
    try {
      const response = await api.post('/preferences', preferencesData);
      preferences.value = response.data.data;
      return { success: true, data: preferences.value };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update preferences',
      };
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      favorites.value = response.data.data.data || [];
      return favorites.value;
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      return [];
    }
  };

  const addFavorite = async (favoriteData) => {
    try {
      const response = await api.post('/favorites', favoriteData);
      favorites.value.push(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add favorite',
      };
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      favorites.value = favorites.value.filter((fav) => fav.id !== favoriteId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove favorite',
      };
    }
  };

  const fetchDiaryEntries = async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await api.get('/diary', { params });

      if (response.data.success) {
        diaryEntries.value =
          response.data.data.entries || response.data.data || [];
        return { success: true, data: diaryEntries.value };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Failed to fetch diary entries:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch diary entries',
      };
    }
  };

  const createDiaryEntry = async (entryData) => {
    try {
      const response = await api.post('/diary', entryData);

      if (response.data.success) {
        // Refresh diary entries dan summary
        await fetchDiaryEntries();
        await fetchDailySummary(entryData.date);

        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create diary entry',
      };
    }
  };

  const deleteDiaryEntry = async (entryId) => {
    try {
      const response = await api.delete(`/diary/${entryId}`);

      if (response.data.success) {
        // Refresh diary entries dan summary
        await fetchDiaryEntries();
        await fetchDailySummary(new Date().toISOString().split('T')[0]);

        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete diary entry',
      };
    }
  };

  // ✅ TAMBAHKAN: Reset store
  const reset = () => {
    user.value = null;
    profile.value = null;
    preferences.value = null;
    favorites.value = [];
    diaryEntries.value = [];
    onboardingProgress.value = null;
    deviceConnected.value = false;
    dailySummary.value = null;
    recentDiaryEntries.value = [];
    exerciseRecords.value = [];
  };

  return {
    // State
    user, // ✅ TAMBAHKAN INI
    profile,
    preferences,
    favorites,
    diaryEntries,
    onboardingProgress,
    deviceConnected,
    dailySummary,
    recentDiaryEntries,
    exerciseRecords,

    // Computed
    needsDeviceConnection,

    // Actions
    fetchUser, // ✅ TAMBAHKAN INI
    updateUser, // ✅ TAMBAHKAN INI
    deleteUser, // ✅ TAMBAHKAN INI
    fetchOnboardingProgress,
    updateOnboardingProgress,
    checkDeviceConnection,
    fetchProfile,
    updateProfile,
    fetchPreferences,
    updatePreferences,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    fetchDailySummary,
    fetchRecentDiaryEntries,
    fetchExerciseRecords,
    updateDailySummary,
    reset,
    syncTargetCalories,
    getUserTargetCalories,
    createDiaryEntry,
    deleteDiaryEntry,
    fetchDiaryEntries,
  };
});
