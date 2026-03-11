// Reference: https://github.com/jsdom/jsdom/issues/2448#issuecomment-1581009331
window.MessageChannel = jest.fn().mockImplementation(() => {
  return {
    port1: {
      addEventListener: jest.fn(),
      close: jest.fn(),
      dispatchEvent: jest.fn(),
      postMessage: jest.fn(),
      removeEventListener: jest.fn(),
      start: jest.fn(),
    },
    port2: {
      addEventListener: jest.fn(),
      close: jest.fn(),
      dispatchEvent: jest.fn(),
      postMessage: jest.fn(),
      removeEventListener: jest.fn(),
      start: jest.fn(),
    },
  }
})
