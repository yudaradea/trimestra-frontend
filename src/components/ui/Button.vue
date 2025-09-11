<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-outline': variant === 'outline',
        'btn-danger': variant === 'danger',
        'btn-ghost': variant === 'ghost',
        'opacity-50 cursor-not-allowed': disabled || loading,
        'px-4 py-2 text-sm': size === 'sm',
        'px-6 py-3': size === 'md',
        'px-8 py-4 text-lg': size === 'lg',
      },
      className,
    ]"
    @click="$emit('click', $event)"
  >
    <slot v-if="!loading" />
    <span v-else class="flex items-center">
      <LoadingSpinner class="mr-2" />
      {{ loadingText }}
    </span>
  </button>
</template>

<script setup>
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'outline', 'danger', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  className: {
    type: String,
    default: '',
  },
});

defineEmits(['click']);
</script>
