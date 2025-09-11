import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

// Auth Views
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import Onboarding from '@/views/auth/Onboarding.vue';

// Home Views
import Home from '@/views/home/Home.vue';
import Favorites from '@/views/home/Favorites.vue';
import Profile from '@/views/home/Profile.vue';
import Diary from '@/views/home/Diary.vue';
import Tracking from '@/views/home/Tracking.vue';

// Food Views
import FoodList from '@/views/foods/FoodList.vue';
import FoodDetail from '@/views/foods/FoodDetail.vue';
import FoodSearch from '@/views/foods/FoodSearch.vue';

// Recipe Views
import RecipeList from '@/views/recipes/RecipeList.vue';
import RecipeDetail from '@/views/recipes/RecipeDetail.vue';

// Profile Views
import EditProfile from '@/views/profile/EditProfile.vue';
import Preferences from '@/views/profile/Preferences.vue';
import Settings from '@/views/profile/Settings.vue';

const routes = [
  // Auth Routes
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/onboarding', name: 'Onboarding', component: Onboarding },

  // Main App Routes
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true, requiresOnboardingCompleted: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/diary',
    name: 'Diary',
    component: Diary,
    meta: { requiresAuth: true, requiresOnboardingCompleted: true },
  },
  {
    path: '/tracking',
    name: 'Tracking',
    component: Tracking,
    meta: { requiresAuth: true, requiresOnboardingCompleted: true },
  },

  // Food Routes
  {
    path: '/foods',
    name: 'FoodList',
    component: FoodList,
    meta: { requiresAuth: true },
  },
  {
    path: '/foods/:id',
    name: 'FoodDetail',
    component: FoodDetail,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/search',
    name: 'FoodSearch',
    component: FoodSearch,
    meta: { requiresAuth: true },
  },

  // Recipe Routes
  {
    path: '/recipes',
    name: 'RecipeList',
    component: RecipeList,
    meta: { requiresAuth: true },
  },
  {
    path: '/recipes/:id',
    name: 'RecipeDetail',
    component: RecipeDetail,
    meta: { requiresAuth: true },
    props: true,
  },

  // Profile Routes
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/preferences',
    name: 'Preferences',
    component: Preferences,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true },
  },
  {
    path: '/device-connect',
    name: 'DeviceConnect',
    component: () => import('../views/profile/DeviceConnect.vue'),
    meta: { requiresAuth: true },
  },

  // Catch all
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  // Redirect authenticated users away from auth pages
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/');
    return;
  }

  // Require authentication for protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }

  // Handle onboarding completion requirement
  if (to.meta.requiresOnboardingCompleted) {
    // Only check if user is authenticated
    if (authStore.isAuthenticated) {
      try {
        // Fetch user onboarding progress if not already loaded
        if (!userStore.onboardingProgress) {
          await userStore.fetchOnboardingProgress();
        }

        // Check if onboarding is completed OR has reached step 3
        const progress = userStore.onboardingProgress;
        if (progress && (progress.completed || progress.current_step >= 3)) {
          next();
          return;
        } else {
          // Redirect to onboarding if not completed
          next('/onboarding');
          return;
        }
      } catch (error) {
        console.error('Failed to check onboarding progress:', error);
        next('/onboarding');
        return;
      }
    } else {
      next('/login');
      return;
    }
  }

  next();
});

export default router;
