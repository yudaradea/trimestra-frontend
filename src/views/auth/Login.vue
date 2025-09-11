<template>
  <div class="flex items-center justify-center min-h-screen px-4 bg-background">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-primary">TRIMESTRA</h1>
        <p class="text-gray-600">Login to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Input -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200',
              errors.email ? 'border-red-500' : 'border-gray-300',
            ]"
            placeholder="Enter your email"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password Input with Show/Hide -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              :class="[
                'w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200',
                errors.password ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="Enter your password"
              @input="clearError('password')"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <EyeOffIcon v-if="showPassword" class="w-5 h-5" />
              <EyeIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="loading"
          :class="[
            'w-full py-3 px-6 rounded-lg font-medium transition duration-200',
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-orange-600 text-white shadow-md hover:shadow-lg',
          ]"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <LoadingSpinner class="w-5 h-5 mr-2" />
            Logging in...
          </span>
          <span v-else>Login</span>
        </button>

        <!-- Error Message -->
        <div
          v-if="generalError"
          class="p-3 text-sm text-center text-red-500 rounded-lg bg-red-50"
        >
          {{ generalError }}
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don't have an account?
          <router-link
            to="/register"
            class="font-medium text-primary hover:underline"
          >
            Register
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

// Icons
const EyeIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>',
};

const EyeOffIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>',
};

// Router & Store
const router = useRouter();
const authStore = useAuthStore();

// Reactive state
const form = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const generalError = ref('');
const showPassword = ref(false);

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const clearError = (field) => {
  if (field) {
    errors[field] = '';
  } else {
    errors.email = '';
    errors.password = '';
  }
  generalError.value = '';
};

const validateForm = () => {
  let isValid = true;

  // Reset errors
  clearError();

  // Email validation
  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async (event) => {
  // Reset errors
  generalError.value = '';

  // Validate form
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    });

    if (result.success) {
      // Fetch user data
      await authStore.fetchUser();

      // Redirect to home
      router.push('/');
    } else {
      // ✅ Handle specific error messages properly
      if (result.error?.response?.status === 401) {
        generalError.value =
          'Email or password is incorrect. Please try again.';
      } else if (result.error?.response?.data?.message) {
        generalError.value = result.error.response.data.message;
      } else if (result.error) {
        generalError.value = result.error;
      } else {
        generalError.value = 'Login failed. Please try again.';
      }

      // ✅ JANGAN REFRESH PAGE - Tampilkan error
      console.error('Login failed:', result.error);
    }
  } catch (error) {
    console.error('Login error:', error);

    // ✅ Handle network errors
    if (error.response?.status === 401) {
      generalError.value = 'Email or password is incorrect. Please try again.';
    } else if (error.response?.data?.message) {
      generalError.value = error.response.data.message;
    } else {
      generalError.value = 'An unexpected error occurred. Please try again.';
    }
  } finally {
    loading.value = false;
    // ✅ JANGAN REFRESH PAGE - Biarkan user melihat error
  }
};
</script>
