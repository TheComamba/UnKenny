const Hooks = {
  events: {},
  on: function (event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
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
  trigger: function (event, ...args) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach(callback => callback(...args));
  },
};

export default Hooks;
