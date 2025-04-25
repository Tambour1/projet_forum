<script setup>
import { ref } from 'vue';
import { useNotificationStore } from '~/stores/notification';

const notificationStore = useNotificationStore();
const isVisible = ref(notificationStore.isVisible);
const message = ref(notificationStore.message);
const notificationClass = ref(notificationStore.notificationClass);

notificationStore.$subscribe((mutation, state) => {
    isVisible.value = state.isVisible;
    message.value = state.message;
    notificationClass.value = state.notificationClass;
});

const closeNotification = () => {
    notificationStore.hideNotification();
};
</script>

<template>
    <div v-if="isVisible" class="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-50">
        <div :class="['p-4 rounded-lg shadow-lg transition-all duration-300', notificationClass]"
            @click="closeNotification">
            <p class="text-white">{{ message }}</p>
        </div>
    </div>
</template>



<style scoped>
.success {
    background-color: #28a745;
}

.error {
    background-color: #dc3545;
}

.info {
    background-color: #17a2b8;
}

.warning {
    background-color: #ffc107;
}
</style>