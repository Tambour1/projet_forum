import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    isVisible: false,
    message: '',
    notificationClass: 'info', 
  }),

  actions: {
    showNotification(message: string, notificationClass: string = 'info') {
      this.message = message;
      this.notificationClass = notificationClass;
      this.isVisible = true;

      setTimeout(() => {
        this.hideNotification();
      }, 3000);
    },

    hideNotification() {
      this.isVisible = false;
    },
  },
});
