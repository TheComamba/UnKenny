import { jest } from '@jest/globals';

const Hooks = {
  on: jest.fn(),
};

Hooks.on.mockImplementation((event, callback) => {
  // Mock implementation here
});

export default Hooks;
