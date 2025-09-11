<template>
  <div class="flex items-center justify-center min-h-screen px-4 bg-background">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-primary">TRIMESTRA</h1>
        <p class="text-gray-600">Create your account</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <Input
          v-model="form.name"
          label="Full Name"
          type="text"
          required
          :error="errors.name"
          placeholder="Enter your full name"
        />

        <Input
          v-model="form.email"
          label="Email"
          type="email"
          required
          :error="errors.email"
          placeholder="Enter your email"
        />

        <Input
          v-model="form.phone"
          label="Phone Number"
          type="tel"
          required
          :error="errors.phone"
          placeholder="Enter your phone number"
        />

        <Input
          v-model="form.password"
          label="Password"
          type="password"
          required
          :error="errors.password"
          placeholder="Enter your password"
        />

        <Input
          v-model="form.password_confirmation"
          label="Confirm Password"
          type="password"
          required
          :error="errors.password_confirmation"
          placeholder="Confirm your password"
        />

        <Button
          type="submit"
          :loading="loading"
          :loading-text="'Creating account...'"
          class="w-full"
        >
          Register
        </Button>

        <div v-if="error" class="text-sm text-center text-red-500">
          {{ error }}
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-primary hover:underline"
            >Login</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
});

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
});

const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  resetErrors();

  // Validation
  validateForm();

  if (hasErrors()) {
    loading.value = false;
    return;
  }

  const result = await authStore.register(form);

  if (result.success) {
    await authStore.fetchUser();
    router.push('/onboarding');
  } else {
    error.value = result.error;
  }

  loading.value = false;
};

const validateForm = () => {
  if (!form.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid';
  }

  if (!form.phone) {
    errors.phone = 'Phone number is required';
  }

  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match';
  }
};

const hasErrors = () => {
  return Object.values(errors).some((error) => error);
};

const resetErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = '';
  });
};
</script>
