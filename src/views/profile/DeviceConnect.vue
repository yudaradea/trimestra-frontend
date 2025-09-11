<!-- src/views/profile/DeviceConnect.vue -->
<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container px-4 py-4 mx-auto">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-primary"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 class="text-xl font-bold text-primary">Connect Device</h1>
          <div></div>
        </div>
      </div>
    </div>

    <div class="container px-4 py-6 mx-auto">
      <Card>
        <div class="p-6">
          <div class="mb-8 text-center">
            <div
              class="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-primary"
            >
              <DeviceIcon class="w-12 h-12 text-white" />
            </div>
            <h2 class="mb-2 text-2xl font-bold text-gray-900">
              Connect Your Device
            </h2>
            <p class="text-gray-600">
              Connect your smart device to track your activity and sync exercise
              data automatically.
            </p>
          </div>

          <div class="space-y-6">
            <!-- How to Connect -->
            <div class="p-6 rounded-lg bg-gray-50">
              <h3 class="mb-4 font-medium text-gray-900">How to Connect</h3>
              <ol class="space-y-3 text-left text-gray-700">
                <li class="flex items-start">
                  <span
                    class="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-3 text-sm font-medium text-white rounded-full bg-primary"
                    >1</span
                  >
                  <span>Open the TRIMESTRA app on your smart device</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-3 text-sm font-medium text-white rounded-full bg-primary"
                    >2</span
                  >
                  <span>Go to Settings > Device Connection</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-3 text-sm font-medium text-white rounded-full bg-primary"
                    >3</span
                  >
                  <span>Scan the QR code below or enter the pairing code</span>
                </li>
              </ol>
            </div>

            <!-- QR Code -->
            <div
              class="p-8 text-center bg-white border-2 border-gray-300 border-dashed rounded-lg"
            >
              <div
                class="flex items-center justify-center w-48 h-48 mx-auto mb-4 bg-gray-100 rounded"
              >
                <QRCodeIcon class="w-24 h-24 text-gray-400" />
              </div>
              <p class="text-gray-500">QR Code will appear here</p>
              <p class="mt-2 text-sm text-gray-500">
                Pairing Code: <strong>ABC123XYZ</strong>
              </p>
            </div>

            <!-- Manual Pairing -->
            <div class="space-y-4">
              <input
                v-model="pairingCode"
                type="text"
                placeholder="Enter pairing code"
                class="w-full font-mono text-lg text-center input-field"
              />
              <Button
                @click="connectWithCode"
                :disabled="!pairingCode"
                class="w-full btn-primary"
              >
                Connect with Code
              </Button>
            </div>

            <!-- Skip Option -->
            <div class="pt-4 text-center">
              <button
                @click="skipDevice"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';

// Icons
const ArrowLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
};

const DeviceIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
};

const QRCodeIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1V8zm0 8h2a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1z" /></svg>',
};

const router = useRouter();
const userStore = useUserStore();

const pairingCode = ref('');

const goBack = () => {
  router.back();
};

const connectWithCode = async () => {
  try {
    // Connect device logic here
    console.log('Connecting with code:', pairingCode.value);
    // await userStore.connectDevice(pairingCode.value)
    router.push('/');
  } catch (error) {
    console.error('Failed to connect device:', error);
  }
};

const skipDevice = async () => {
  try {
    // Update onboarding progress
    await userStore.updateOnboardingProgress({
      current_step: 3,
      completed: true,
    });
    router.push('/');
  } catch (error) {
    console.error('Failed to skip device connection:', error);
  }
};
</script>
