// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null);
  const isAuthenticated = computed(() => !!token.value);

  // ✅ PERBAIKAN: Register dengan integrasi yang lebih baik
  const register = async (credentials) => {
    try {
      const response = await api.post('/register', credentials);
      const data = response.data;

      if (data.success) {
        token.value = data.data.token;
        user.value = data.data.user;

        localStorage.setItem('token', data.data.token);
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.data.token}`;

        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // ✅ PERBAIKAN: Login dengan integrasi yang lebih baik
  // src/stores/auth.js
  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const data = response.data;

      if (data.success) {
        token.value = data.data.token;
        user.value = data.data.user;

        localStorage.setItem('token', data.data.token);
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.data.token}`;

        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      // ✅ Return error object properly instead of throwing
      return {
        success: false,
        error: error,
      };
    }
  };

  // ✅ PERBAIKAN: Logout dengan cleanup yang benar
  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  // ✅ PERBAIKAN: Fetch user dengan integrasi ke user store
  const fetchUser = async () => {
    if (!token.value) return null;

    try {
      const response = await api.get('/user');
      user.value = response.data.data;
      return user.value;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
      return null;
    }
  };

  // ✅ TAMBAHKAN: Update user
  const updateUser = async (userData) => {
    try {
      let response;

      // Cek apakah ada file foto
      if (userData.profile_photo) {
        // Upload dengan FormData untuk file
        const formData = new FormData();

        // Tambahkan data user
        Object.keys(userData).forEach((key) => {
          if (key !== 'profile_photo') {
            formData.append(key, userData[key]);
          }
        });

        // Tambahkan file foto
        formData.append('profile_photo', userData.profile_photo);

        response = await api.post('/user', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Update tanpa foto
        response = await api.post('/user', userData);
      }

      user.value = response.data.data;

      return { success: true, user: user.value };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user',
      };
    }
  };

  // ✅ TAMBAHKAN: Delete user
  const deleteUser = async () => {
    if (!token.value) return { success: false, error: 'Not authenticated' };

    try {
      await api.delete('/user');
      logout();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user',
      };
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
    updateUser,
    deleteUser,
  };
});
