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
          <h1 class="text-xl font-bold text-primary">Settings</h1>
          <div></div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container px-4 py-6 mx-auto">
      <!-- Account Settings -->
      <Card class="mb-6">
        <div class="p-6">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">
            Account Settings
          </h2>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Change Password</h3>
                <p class="text-sm text-gray-600">
                  Update your password regularly
                </p>
              </div>
              <button
                @click="openChangePassword"
                class="text-primary hover:text-orange-600"
              >
                <PencilIcon class="w-5 h-5" />
              </button>
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p class="text-sm text-gray-600">
                  Add extra security to your account
                </p>
              </div>
              <ToggleSwitch
                v-model="twoFactorEnabled"
                @update:model-value="toggleTwoFactor"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Delete Account</h3>
                <p class="text-sm text-gray-600">
                  Permanently remove your account
                </p>
              </div>
              <button
                @click="openDeleteAccount"
                class="text-red-500 hover:text-red-700"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <!-- Notification Settings -->
      <Card class="mb-6">
        <div class="p-6">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">
            Notifications
          </h2>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Push Notifications</h3>
                <p class="text-sm text-gray-600">Receive push notifications</p>
              </div>
              <ToggleSwitch
                v-model="pushNotificationsEnabled"
                @update:model-value="togglePushNotifications"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Email Notifications</h3>
                <p class="text-sm text-gray-600">Receive email notifications</p>
              </div>
              <ToggleSwitch
                v-model="emailNotificationsEnabled"
                @update:model-value="toggleEmailNotifications"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">SMS Notifications</h3>
                <p class="text-sm text-gray-600">Receive SMS notifications</p>
              </div>
              <ToggleSwitch
                v-model="smsNotificationsEnabled"
                @update:model-value="toggleSmsNotifications"
              />
            </div>
          </div>
        </div>
      </Card>

      <!-- Privacy Settings -->
      <Card class="mb-6">
        <div class="p-6">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Privacy</h2>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Make Profile Private</h3>
                <p class="text-sm text-gray-600">
                  Hide your profile from other users
                </p>
              </div>
              <ToggleSwitch
                v-model="profilePrivate"
                @update:model-value="toggleProfilePrivacy"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Data Sharing</h3>
                <p class="text-sm text-gray-600">
                  Share anonymous data for research
                </p>
              </div>
              <ToggleSwitch
                v-model="dataSharingEnabled"
                @update:model-value="toggleDataSharing"
              />
            </div>
          </div>
        </div>
      </Card>

      <!-- About -->
      <Card>
        <div class="p-6">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">About</h2>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Version</h3>
                <p class="text-sm text-gray-600">v1.0.0</p>
              </div>
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Terms of Service</h3>
                <p class="text-sm text-gray-600">
                  Read our terms and conditions
                </p>
              </div>
              <button
                @click="openTerms"
                class="text-primary hover:text-orange-600"
              >
                <ExternalLinkIcon class="w-5 h-5" />
              </button>
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-gray-900">Privacy Policy</h3>
                <p class="text-sm text-gray-600">Read our privacy policy</p>
              </div>
              <button
                @click="openPrivacyPolicy"
                class="text-primary hover:text-orange-600"
              >
                <ExternalLinkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Change Password Modal -->
    <Modal v-model="showChangePassword" title="Change Password" size="md">
      <form @submit.prevent="changePassword" class="p-4 space-y-4">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Current Password</label
          >
          <input
            v-model="passwordForm.current_password"
            type="password"
            class="w-full input-field"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >New Password</label
          >
          <input
            v-model="passwordForm.new_password"
            type="password"
            class="w-full input-field"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >Confirm New Password</label
          >
          <input
            v-model="passwordForm.confirm_password"
            type="password"
            class="w-full input-field"
            placeholder="Confirm new password"
          />
        </div>

        <div v-if="passwordError" class="text-sm text-red-500">
          {{ passwordError }}
        </div>
      </form>
      <template #footer>
        <Button @click="showChangePassword = false" variant="outline">
          Cancel
        </Button>
        <Button @click="changePassword" :loading="changingPassword">
          Change Password
        </Button>
      </template>
    </Modal>

    <!-- Delete Account Modal -->
    <Modal v-model="showDeleteAccount" title="Delete Account" size="md">
      <div class="p-4">
        <div class="text-center">
          <div
            class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full"
          >
            <ExclamationIcon class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="mb-2 text-lg font-medium text-gray-900">
            Are you absolutely sure?
          </h3>
          <p class="mb-4 text-gray-600">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </p>
          <input
            v-model="deleteConfirmation"
            type="text"
            class="w-full input-field"
            placeholder="Type DELETE to confirm"
          />
        </div>
      </div>
      <template #footer>
        <Button @click="showDeleteAccount = false" variant="outline">
          Cancel
        </Button>
        <Button
          @click="deleteAccount"
          variant="danger"
          :disabled="deleteConfirmation !== 'DELETE'"
        >
          Delete Account
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

// Icons
const ArrowLeftIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>',
};

const PencilIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>',
};

const TrashIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>',
};

const ExternalLinkIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>',
};

const ExclamationIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
};

// Stores & Router
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Reactive state
const twoFactorEnabled = ref(false);
const pushNotificationsEnabled = ref(true);
const emailNotificationsEnabled = ref(true);
const smsNotificationsEnabled = ref(false);
const profilePrivate = ref(false);
const dataSharingEnabled = ref(false);

const showChangePassword = ref(false);
const showDeleteAccount = ref(false);
const changingPassword = ref(false);
const deleteConfirmation = ref('');

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
});

const passwordError = ref('');
const deleteError = ref('');

// Methods
const goBack = () => {
  router.back();
};

const openChangePassword = () => {
  showChangePassword.value = true;
  passwordForm.value = {
    current_password: '',
    new_password: '',
    confirm_password: '',
  };
  passwordError.value = '';
};

const openDeleteAccount = () => {
  showDeleteAccount.value = true;
  deleteConfirmation.value = '';
  deleteError.value = '';
};

const changePassword = async () => {
  changingPassword.value = true;
  passwordError.value = '';

  try {
    // Validate passwords
    if (
      passwordForm.value.new_password !== passwordForm.value.confirm_password
    ) {
      passwordError.value = 'New passwords do not match';
      changingPassword.value = false;
      return;
    }

    // Change password logic here
    console.log('Changing password:', passwordForm.value);

    showChangePassword.value = false;
  } catch (err) {
    passwordError.value = 'Failed to change password';
    console.error('Change password error:', err);
  } finally {
    changingPassword.value = false;
  }
};

const deleteAccount = async () => {
  if (deleteConfirmation.value !== 'DELETE') return;

  try {
    // Delete account logic here
    console.log('Deleting account');

    await authStore.logout();
    router.push('/login');
  } catch (err) {
    deleteError.value = 'Failed to delete account';
    console.error('Delete account error:', err);
  }
};

const toggleTwoFactor = (enabled) => {
  console.log('Toggle two-factor:', enabled);
  // Two-factor toggle logic here
};

const togglePushNotifications = (enabled) => {
  console.log('Toggle push notifications:', enabled);
  // Push notifications toggle logic here
};

const toggleEmailNotifications = (enabled) => {
  console.log('Toggle email notifications:', enabled);
  // Email notifications toggle logic here
};

const toggleSmsNotifications = (enabled) => {
  console.log('Toggle SMS notifications:', enabled);
  // SMS notifications toggle logic here
};

const toggleProfilePrivacy = (enabled) => {
  console.log('Toggle profile privacy:', enabled);
  // Profile privacy toggle logic here
};

const toggleDataSharing = (enabled) => {
  console.log('Toggle data sharing:', enabled);
  // Data sharing toggle logic here
};

const openTerms = () => {
  // Open terms of service
  window.open('/terms', '_blank');
};

const openPrivacyPolicy = () => {
  // Open privacy policy
  window.open('/privacy', '_blank');
};

// Lifecycle
onMounted(() => {
  // Load current settings
  console.log('Loading settings...');
});
</script>
