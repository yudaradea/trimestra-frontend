<template>
  <div id="app" class="flex flex-col min-h-screen bg-background">
    <!-- Header -->
    <AppHeader v-if="showHeader" />

    <!-- Main Content -->
    <main class="flex-1 pb-20 md:pb-0">
      <router-view />
    </main>

    <!-- Bottom Navigation (Mobile) -->
    <BottomNavigation v-if="showNavigation" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import BottomNavigation from '@/components/layout/BottomNavigation.vue';

const route = useRoute();

const showHeader = computed(() => {
  return !['/login', '/register', '/onboarding'].includes(route.path);
});

const showNavigation = computed(() => {
  return !['/login', '/register', '/onboarding'].includes(route.path);
});
</script>
