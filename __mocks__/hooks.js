import { jest } from '@jest/globals';

const Hooks = {
  on: jest.fn(),
  once: jest.fn(),
};

Hooks.on.mockImplementation((event, callback) => {
  // Mock implementation here
});

Hooks.once.mockImplementation((event, callback) => {
  callback();
});

export default Hooks;
