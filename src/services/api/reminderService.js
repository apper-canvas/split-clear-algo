import balanceService from './balanceService';
import { toast } from 'react-toastify';

const LAST_NOTIFICATION_KEY = 'splitclear_last_reminder_notification';

const reminderService = {
  async checkAndNotifySettlements() {
    try {
      const settings = JSON.parse(localStorage.getItem('splitclear_settings') || '{}');
      const notifications = settings.notifications || {};

      if (!notifications.settlementReminders) {
        return;
      }

      if (!this.shouldNotifyNow(notifications.reminderFrequency)) {
        return;
      }

      if (this.isInQuietHours(notifications.quietHours)) {
        return;
      }

      const balances = await balanceService.getAll();
      const pendingSettlements = balances.filter(b => b.amount > 0);

      if (pendingSettlements.length === 0) {
        return;
      }

      const totalAmount = pendingSettlements.reduce((sum, b) => sum + b.amount, 0);
      const message = `You have ${pendingSettlements.length} pending settlement${pendingSettlements.length > 1 ? 's' : ''} totaling ₹${totalAmount.toFixed(2)}`;

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Settlement Reminder', {
          body: message,
          icon: '/icon.png',
          badge: '/badge.png',
          tag: 'settlement-reminder',
          requireInteraction: false
        });
      } else {
        toast.info(message, { autoClose: 5000 });
      }

      localStorage.setItem(LAST_NOTIFICATION_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error checking settlement reminders:', error);
    }
  },

  shouldNotifyNow(frequency) {
    const lastNotification = localStorage.getItem(LAST_NOTIFICATION_KEY);
    
    if (!lastNotification) {
      return true;
    }

    const lastTime = parseInt(lastNotification, 10);
    const now = Date.now();
    const timeDiff = now - lastTime;

    const intervals = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      'bi-weekly': 14 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    };

    const interval = intervals[frequency] || intervals.weekly;
    return timeDiff >= interval;
  },

  isInQuietHours(quietHours) {
    if (!quietHours || !quietHours.start || !quietHours.end) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = quietHours.start.split(':').map(Number);
    const [endHour, endMin] = quietHours.end.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  },

  getNextNotificationTime(frequency) {
    const lastNotification = localStorage.getItem(LAST_NOTIFICATION_KEY);
    
    if (!lastNotification) {
      return new Date();
    }

    const lastTime = parseInt(lastNotification, 10);
    const intervals = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      'bi-weekly': 14 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    };

    const interval = intervals[frequency] || intervals.weekly;
    return new Date(lastTime + interval);
  }
};

export default reminderService;