<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeModal"
    >
      <div
        class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <transition name="modal-overlay">
          <div
            v-show="modelValue"
            class="fixed inset-0 transition-opacity bg-black bg-opacity-50"
            @click="closeModal"
          />
        </transition>

        <!-- Modal container -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <transition name="modal">
          <div
            v-show="modelValue"
            :class="[
              'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full',
              sizeClasses[size],
              className,
            ]"
          >
            <!-- Modal header -->
            <div class="px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-4">
              <div class="flex items-start justify-between">
                <div class="flex items-center">
                  <div
                    v-if="icon"
                    :class="[
                      'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10',
                      iconBackgroundClass,
                    ]"
                  >
                    <component :is="icon" class="w-6 h-6" :class="iconClass" />
                  </div>
                  <div class="mt-0 ml-4 text-left">
                    <h3
                      v-if="title"
                      class="text-lg font-medium leading-6 text-gray-900"
                      :id="`${id}-title`"
                    >
                      {{ title }}
                    </h3>
                  </div>
                </div>
                <button
                  v-if="showCloseButton"
                  type="button"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click="closeModal"
                >
                  <XIcon class="w-6 h-6" />
                </button>
              </div>
            </div>

            <!-- Modal body -->
            <div class="px-4 pb-4 sm:px-6 sm:pb-6">
              <slot />
            </div>

            <!-- Modal footer -->
            <div
              v-if="$slots.footer"
              class="gap-4 px-4 py-3 space-x-2 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value),
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconClass: {
    type: String,
    default: 'text-white',
  },
  iconBackgroundClass: {
    type: String,
    default: 'bg-primary',
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  closeOnEscape: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: () => `modal-${Math.random().toString(36).substr(2, 9)}`,
  },
});

const emit = defineEmits(['update:modelValue']);

const sizeClasses = computed(() => ({
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-full',
}));

const closeModal = () => {
  emit('update:modelValue', false);
};

const handleEscape = (event) => {
  if (props.closeOnEscape && event.key === 'Escape' && props.modelValue) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});

// Icons
const XIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}
</style>
