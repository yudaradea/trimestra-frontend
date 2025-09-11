<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-primary">Tracking</h1>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              class="p-2 transition-colors rounded-lg hover:bg-gray-100"
              :disabled="loading"
            >
              <RefreshIcon
                class="w-5 h-5 text-gray-600"
                :class="{ 'animate-spin': loading }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner text="Loading tracking data..." />
      </div>

      <!-- Tracking Dashboard -->
      <div v-else>
        <!-- Weekly Overview -->
        <Card class="mb-6">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Weekly Overview</h2>
              <div class="flex items-center space-x-2">
                <button
                  @click="previousWeek"
                  class="p-2 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
                </button>
                <span class="text-sm font-medium text-gray-700">
                  {{ weekRange }}
                </span>
                <button
                  @click="nextWeek"
                  class="p-2 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ChevronRightIcon class="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <!-- Weekly Stats -->
            <div class="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
              <div class="p-4 text-center rounded-lg bg-blue-50">
                <div class="text-2xl font-bold text-blue-600">
                  {{ weeklyStats.average_calories }}
                </div>
                <div class="text-sm text-gray-600">Avg Calories</div>
              </div>
              <div class="p-4 text-center rounded-lg bg-green-50">
                <div class="text-2xl font-bold text-green-600">
                  {{ weeklyStats.exercise_days }}
                </div>
                <div class="text-sm text-gray-600">Exercise Days</div>
              </div>
              <div class="p-4 text-center rounded-lg bg-purple-50">
                <div class="text-2xl font-bold text-purple-600">
                  {{ weeklyStats.water_glasses }}
                </div>
                <div class="text-sm text-gray-600">Water Glasses</div>
              </div>
              <div class="p-4 text-center rounded-lg bg-orange-50">
                <div class="text-2xl font-bold text-orange-600">
                  {{ weeklyStats.sleep_hours }}
                </div>
                <div class="text-sm text-gray-600">Sleep Hours</div>
              </div>
            </div>

            <!-- Weekly Chart -->
            <div class="h-64">
              <canvas ref="weeklyChart"></canvas>
            </div>
          </div>
        </Card>

        <!-- Monthly Progress -->
        <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          <Card>
            <div class="p-6">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">
                Monthly Progress
              </h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-1 text-sm">
                    <span>Calories Goal</span>
                    <span>{{ monthlyProgress.calories_percentage }}%</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-2 rounded-full bg-primary"
                      :style="{
                        width: monthlyProgress.calories_percentage + '%',
                      }"
                    ></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-1 text-sm">
                    <span>Exercise Goal</span>
                    <span>{{ monthlyProgress.exercise_percentage }}%</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-2 bg-green-500 rounded-full"
                      :style="{
                        width: monthlyProgress.exercise_percentage + '%',
                      }"
                    ></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-1 text-sm">
                    <span>Water Intake</span>
                    <span>{{ monthlyProgress.water_percentage }}%</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-2 bg-blue-500 rounded-full"
                      :style="{ width: monthlyProgress.water_percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div class="p-6">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">
                Achievements
              </h3>
              <div class="space-y-3">
                <div
                  v-for="achievement in achievements"
                  :key="achievement.id"
                  class="flex items-center p-3 border rounded-lg"
                  :class="
                    achievement.unlocked
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  "
                >
                  <div
                    class="flex items-center justify-center w-10 h-10 mr-3 rounded-full"
                    :class="
                      achievement.unlocked
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    "
                  >
                    <component :is="achievement.icon" class="w-6 h-6" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">
                      {{ achievement.title }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{ achievement.description }}
                    </p>
                  </div>
                  <div
                    v-if="achievement.unlocked"
                    class="ml-auto text-green-500"
                  >
                    <CheckCircleIcon class="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Recent Activity -->
        <Card>
          <div class="p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start p-4 transition-colors rounded-lg hover:bg-gray-50"
              >
                <div
                  class="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 rounded-full"
                  :class="
                    activity.type === 'food'
                      ? 'bg-orange-100 text-orange-600'
                      : activity.type === 'exercise'
                      ? 'bg-green-100 text-green-600'
                      : activity.type === 'water'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  "
                >
                  <component :is="activity.icon" class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">
                    {{ activity.title }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    {{ activity.description }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">{{ activity.time }}</p>
                </div>
                <div class="text-right">
                  <div class="font-medium text-gray-900">
                    {{ activity.value }}
                  </div>
                  <div class="text-xs text-gray-500">{{ activity.unit }}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import Card from '@/components/ui/Card.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

// Register Chart.js components
Chart.register(...registerables);

// Icons
const RefreshIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>',
};

const ChevronLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>',
};

const ChevronRightIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>',
};

const CheckCircleIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
};

const FireIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>',
};

const ActivityIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
};

const DropletIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>',
};

const MoonIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>',
};

// Reactive state
const loading = ref(false);
const weeklyChart = ref(null);
const chartInstance = ref(null);
const currentWeekOffset = ref(0);

// Mock data (would come from API in real implementation)
const weeklyStats = ref({
  average_calories: 1850,
  exercise_days: 4,
  water_glasses: 6,
  sleep_hours: 7.5,
});

const monthlyProgress = ref({
  calories_percentage: 85,
  exercise_percentage: 78,
  water_percentage: 92,
});

const achievements = ref([
  {
    id: 1,
    title: 'First Week Complete',
    description: 'Successfully tracked your nutrition for 7 days',
    unlocked: true,
    icon: FireIcon,
  },
  {
    id: 2,
    title: 'Exercise Streak',
    description: 'Exercised for 5 consecutive days',
    unlocked: true,
    icon: ActivityIcon,
  },
  {
    id: 3,
    title: 'Hydration Master',
    description: 'Drank 8 glasses of water for 3 days straight',
    unlocked: false,
    icon: DropletIcon,
  },
  {
    id: 4,
    title: 'Early Bird',
    description: 'Logged breakfast before 9 AM for 5 days',
    unlocked: false,
    icon: MoonIcon,
  },
]);

const recentActivities = ref([
  {
    id: 1,
    type: 'food',
    title: 'Nasi Goreng',
    description: 'Breakfast entry added',
    time: '2 hours ago',
    value: '650',
    unit: 'calories',
    icon: FireIcon,
  },
  {
    id: 2,
    type: 'exercise',
    title: 'Morning Walk',
    description: '30 minutes walking',
    time: '4 hours ago',
    value: '150',
    unit: 'calories',
    icon: ActivityIcon,
  },
  {
    id: 3,
    type: 'water',
    title: 'Water Intake',
    description: 'Glass of water logged',
    time: '6 hours ago',
    value: '1',
    unit: 'glass',
    icon: DropletIcon,
  },
]);

// Computed properties
const weekRange = computed(() => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(
    today.getDate() + currentWeekOffset.value * 7 - today.getDay()
  );
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
});

// Methods
const refreshData = async () => {
  loading.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Failed to refresh data:', error);
  } finally {
    loading.value = false;
  }
};

const previousWeek = () => {
  currentWeekOffset.value--;
  updateChart();
};

const nextWeek = () => {
  currentWeekOffset.value++;
  updateChart();
};

const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = weeklyChart.value.getContext('2d');
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Calories',
          data: [1800, 1900, 1750, 2000, 1850, 1950, 1800],
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// Lifecycle
onMounted(() => {
  updateChart();
});
</script>
