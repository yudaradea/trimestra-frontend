<template>
  <header class="sticky top-0 z-50 hidden bg-white shadow-sm md:block">
    <div class="container px-4 mx-auto">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <button
            v-if="showBackButton"
            @click="goBack"
            class="p-2 mr-3 transition-colors rounded-lg hover:bg-gray-100 md:hidden"
          >
            <ArrowLeftIcon class="w-5 h-5 text-gray-600" />
          </button>

          <router-link to="/" class="flex items-center">
            <div
              class="flex items-center justify-center w-8 h-8 mr-2 rounded-lg bg-primary"
            >
              <span class="text-sm font-bold text-white">T</span>
            </div>
            <span class="hidden text-xl font-bold text-primary md:block"
              >TRIMESTRA</span
            >
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden space-x-8 md:flex">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="font-medium text-gray-600 transition-colors hover:text-primary"
            :class="{ 'text-primary': isActive(item.path) }"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- User Menu / Mobile Menu Button -->
        <div class="flex items-center space-x-3">
          <!-- Search Button (Desktop) -->
          <button
            @click="openSearch"
            class="hidden p-2 transition-colors rounded-lg md:block hover:bg-gray-100"
          >
            <SearchIcon class="w-5 h-5 text-gray-600" />
          </button>

          <!-- User Avatar Dropdown -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center focus:outline-none"
            >
              <img
                :src="userAvatar"
                :alt="userName"
                class="object-cover w-8 h-8 rounded-full"
                @error="handleAvatarError"
              />
            </button>

            <!-- User Menu Dropdown -->
            <div
              v-show="showUserMenu"
              class="absolute right-0 z-50 w-56 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
              style="top: 100%"
            >
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
              </div>

              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                Profile
              </router-link>

              <router-link
                to="/profile/preferences"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                Preferences
              </router-link>

              <router-link
                to="/profile/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                Settings
              </router-link>

              <hr class="my-1" />

              <button
                @click="logout"
                class="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="p-2 transition-colors rounded-lg md:hidden hover:bg-gray-100"
          >
            <MenuIcon v-if="!showMobileMenu" class="w-5 h-5 text-gray-600" />
            <XIcon v-else class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div
        v-if="showMobileMenu"
        class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
        @click="closeMobileMenu"
      ></div>

      <!-- Mobile Menu -->
      <div
        v-if="showMobileMenu"
        class="fixed inset-y-0 right-0 z-50 w-64 transition-transform duration-300 ease-in-out transform bg-white shadow-xl md:hidden"
        :class="{
          'translate-x-0': showMobileMenu,
          'translate-x-full': !showMobileMenu,
        }"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between p-4 border-b">
            <span class="text-lg font-semibold">Menu</span>
            <button @click="closeMobileMenu">
              <XIcon class="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <nav class="flex-1 py-4">
            <router-link
              v-for="item in navItems"
              :key="item.name"
              :to="item.path"
              class="block px-6 py-3 text-gray-700 hover:bg-gray-100"
              :class="{
                'bg-primary text-white hover:bg-primary': isActive(item.path),
              }"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <div class="p-4 border-t">
            <button
              @click="openSearch"
              class="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <SearchIcon class="w-5 h-5 mr-3" />
              Search Foods
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

// Icons
const ArrowLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
};

const SearchIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
};

const MenuIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>',
};

const XIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
};

// Stores
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Refs
const showUserMenu = ref(false);
const showMobileMenu = ref(false);
const userMenuRef = ref(null);

// Computed
const userAvatar = computed(() => {
  const user = authStore.user;
  if (user?.profile_photo) {
    return user.profile_photo;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'U'
  )}&color=7F9CF5&background=EBF4FF`;
});

const userName = computed(() => authStore.user?.name || 'User');
const userEmail = computed(() => authStore.user?.email || '');

const showBackButton = computed(() => {
  const noBackRoutes = ['/', '/home', '/login', '/register', '/onboarding'];
  return !noBackRoutes.includes(route.path);
});

const navItems = [
  { name: 'home', path: '/', label: 'Home' },
  { name: 'foods', path: '/foods', label: 'Foods' },
  { name: 'recipes', path: '/recipes', label: 'Recipes' },
  { name: 'diary', path: '/diary', label: 'Diary' },
  { name: 'favorites', path: '/favorites', label: 'Favorites' },
];

// Methods
const goBack = () => {
  router.back();
};

const openSearch = () => {
  router.push('/search');
  closeMobileMenu();
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

const isActive = (path) => {
  return route.path === path;
};

const handleAvatarError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName.value
  )}&color=7F9CF5&background=EBF4FF`;
};

// Click outside handlers
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    closeUserMenu();
  }
};

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeUserMenu();
    closeMobileMenu();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
});
</script>
