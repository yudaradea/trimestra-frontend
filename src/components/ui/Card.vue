<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-md overflow-hidden transition duration-200 hover:shadow-lg',
      className,
    ]"
  >
    <div v-if="$slots.header" class="border-b border-gray-200">
      <slot name="header" />
    </div>

    <div :class="contentClass">
      <slot />
    </div>

    <div v-if="$slots.footer" class="border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: '',
  },
  contentClass: {
    type: String,
    default: 'p-6',
  },
});
</script>
