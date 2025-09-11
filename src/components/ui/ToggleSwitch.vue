<template>
  <label class="flex items-center cursor-pointer">
    <div class="relative">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        class="sr-only"
        @change="handleChange"
      />
      <div
        :class="[
          'block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out',
          modelValue ? 'bg-primary' : 'bg-gray-300',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
      ></div>
      <div
        :class="[
          'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out',
          modelValue ? 'transform translate-x-6' : '',
        ]"
      ></div>
    </div>
    <div v-if="$slots.default" class="ml-3 text-gray-700">
      <slot />
    </div>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (event) => {
  if (!props.disabled) {
    emit('update:modelValue', event.target.checked);
  }
};
</script>
