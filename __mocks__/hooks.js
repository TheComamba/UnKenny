const Hooks = {
  events: {},
  on: function (event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].unshift(callback);
  },
  once: function (event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  },
  off: function (event, callback) {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  },
  call: function (event, ...args) {
    if (!this.events[event]) {
      return true;
    }
    const isInterrupted = this.events[event].some(callback => callback(...args) === false);
    return !isInterrupted;
  },
  reset: function () {
    this.events = {};
  }
};

export default Hooks;
