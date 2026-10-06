'use strict';

const EventEmitter = require('events');

class AdminNotificationEventBus extends EventEmitter {
  constructor() {
    super();
    // Support multiple listeners if needed
    this.setMaxListeners(20);
  }

  /**
   * Asynchronously emit an event using setImmediate to guarantee non-blocking execution.
   */
  emitAsync(eventName, payload) {
    setImmediate(() => {
      this.emit(eventName, payload);
    });
  }
}

const adminNotificationEventBus = new AdminNotificationEventBus();

module.exports = adminNotificationEventBus;
