<template>
  <div class="flex items-center justify-center">
    <div
      class="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"
    ></div>
    <span v-if="text" class="ml-2 text-gray-600">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '',
  },
});
</script>
