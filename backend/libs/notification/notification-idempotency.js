'use strict';

const notificationLogRepository = require('../../repository/notification-log.repository');

/**
 * Hybrid Idempotency Store for Admin Notifications.
 * Combines an in-memory lock/cache for sub-millisecond deduplication with
 * persistent PostgreSQL database storage in notification_logs.
 */
class NotificationIdempotencyStore {
  constructor() {
    this.memoryCache = new Set();
    this.inFlightLocks = new Set();
  }

  _composeKey(channel, eventKey) {
    return `${channel}:${eventKey}`;
  }

  /**
   * Check if a notification for this channel and event key has already been processed or is currently in flight.
   */
  async isProcessed(channel, eventKey) {
    const memoryKey = this._composeKey(channel, eventKey);

    // 1. Check in-memory processed cache
    if (this.memoryCache.has(memoryKey)) {
      return true;
    }

    // 2. Check in-memory in-flight lock to prevent concurrent dual sends
    if (this.inFlightLocks.has(memoryKey)) {
      return true;
    }

    // 3. Check persistent database
    try {
      const existing = await notificationLogRepository.findSentNotification(channel, eventKey);
      if (existing) {
        this.memoryCache.add(memoryKey);
        return true;
      }
    } catch (err) {
      // In tests or if DB is disconnected, rely gracefully on memoryCache
      console.warn(`[NotificationIdempotencyStore] DB lookup skipped (${err.message}). Using memory cache.`);
    }

    return false;
  }

  /**
   * Acquire a temporary in-flight lock before initiating remote HTTP/SMTP dispatch.
   */
  acquireLock(channel, eventKey) {
    const memoryKey = this._composeKey(channel, eventKey);
    if (this.inFlightLocks.has(memoryKey)) {
      return false;
    }
    this.inFlightLocks.add(memoryKey);
    return true;
  }

  /**
   * Release lock in case of early termination or skip.
   */
  releaseLock(channel, eventKey) {
    const memoryKey = this._composeKey(channel, eventKey);
    this.inFlightLocks.delete(memoryKey);
  }

  /**
   * Record that the notification was successfully sent.
   */
  async markProcessed(channel, eventKey, metadata = {}) {
    const memoryKey = this._composeKey(channel, eventKey);
    this.memoryCache.add(memoryKey);
    this.inFlightLocks.delete(memoryKey);

    try {
      await notificationLogRepository.recordNotification({
        channel,
        eventKey,
        transactionType: metadata.transactionType || 'UNKNOWN',
        transactionId: metadata.transactionId || 0,
        recipient: metadata.recipient || 'N/A',
        status: metadata.status || 'sent',
        payload: metadata.payload || null,
        errorMessage: metadata.errorMessage || null,
        sentAt: new Date(),
      });
    } catch (err) {
      // If unique constraint error (concurrent write), it's already marked!
      if (err.name && err.name.includes('UniqueConstraint')) {
        return;
      }
      console.warn(`[NotificationIdempotencyStore] Failed to record in DB: ${err.message}`);
    }
  }

  /**
   * Clear in-memory caches (used primarily in test suites).
   */
  clearMemory() {
    this.memoryCache.clear();
    this.inFlightLocks.clear();
  }
}

module.exports = new NotificationIdempotencyStore();
