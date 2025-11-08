import { EventManager } from '.'

enum TestEvent {
  FOO,
  BAR,
}

let eventManager: EventManager<TestEvent> = null!
beforeEach(() => {
  eventManager = new EventManager()
})
afterEach(() => {
  eventManager?.dispose()
  eventManager = null!
})

test('Only one event type involved', () => {

  const onFooEvent1 = jest.fn()
  const onFooEvent2 = jest.fn()

  eventManager.addEventListener(TestEvent.FOO, onFooEvent1)
  eventManager.addEventListener(TestEvent.FOO, onFooEvent2)

  const listenerKeys = Object.keys(eventManager.listeners)
  expect(listenerKeys).toStrictEqual([String(TestEvent.FOO)])
  let fooListeners = [...eventManager.listeners[TestEvent.FOO].values()]
  expect(fooListeners.length).toBe(2)
  expect(Object.is(fooListeners[0], onFooEvent1)).toBe(true)
  expect(Object.is(fooListeners[1], onFooEvent2)).toBe(true)

  eventManager.post(TestEvent.FOO, 'A')
  eventManager.post(TestEvent.FOO, 'B')
  expect(onFooEvent1).toHaveBeenCalledTimes(2)
  expect(onFooEvent2).toHaveBeenCalledTimes(2)
  expect(onFooEvent1).toHaveBeenNthCalledWith(1, 'A')
  expect(onFooEvent2).toHaveBeenNthCalledWith(1, 'A')
  expect(onFooEvent1).toHaveBeenNthCalledWith(2, 'B')
  expect(onFooEvent2).toHaveBeenNthCalledWith(2, 'B')

  eventManager.removeEventListener(TestEvent.FOO, onFooEvent1)
  fooListeners = [...eventManager.listeners[TestEvent.FOO].values()]
  expect(fooListeners.length).toBe(1)
  expect(Object.is(fooListeners[0], onFooEvent2)).toBe(true)

  eventManager.post(TestEvent.FOO, 'C')
  expect(onFooEvent1).toHaveBeenCalledTimes(2)
  expect(onFooEvent2).toHaveBeenCalledTimes(3)
  expect(onFooEvent2).toHaveBeenNthCalledWith(3, 'C')

})

test('Multiple event types involved', () => {

  const onFooEvent = jest.fn()
  const onBarEvent = jest.fn()

  eventManager.addEventListener(TestEvent.FOO, onFooEvent)
  eventManager.addEventListener(TestEvent.BAR, onBarEvent)

  const listenerKeys = Object.keys(eventManager.listeners)
  expect(listenerKeys).toStrictEqual([String(TestEvent.FOO), String(TestEvent.BAR)])
  const fooListeners = [...eventManager.listeners[TestEvent.FOO].values()]
  expect(fooListeners.length).toBe(1)
  const barListeners = [...eventManager.listeners[TestEvent.BAR].values()]
  expect(barListeners.length).toBe(1)
  expect(Object.is(fooListeners[0], onFooEvent)).toBe(true)
  expect(Object.is(barListeners[0], onBarEvent)).toBe(true)

  eventManager.post(TestEvent.FOO, 'A')
  eventManager.post(TestEvent.BAR, 'X')
  eventManager.post(TestEvent.FOO, 'B')
  eventManager.post(TestEvent.BAR, 'Y')
  expect(onFooEvent).toHaveBeenCalledTimes(2)
  expect(onFooEvent).toHaveBeenNthCalledWith(1, 'A')
  expect(onFooEvent).toHaveBeenNthCalledWith(2, 'B')
  expect(onBarEvent).toHaveBeenCalledTimes(2)
  expect(onBarEvent).toHaveBeenNthCalledWith(1, 'X')
  expect(onBarEvent).toHaveBeenNthCalledWith(2, 'Y')

})

test(`${EventManager.prototype.removeEventListener.name} (non-existent listener)`, () => {
  expect(() => {
    eventManager.removeEventListener(TestEvent.FOO, jest.fn())
  }).not.toThrow()
})

test(EventManager.prototype.dispose.name, () => {

  const onFooEvent1 = jest.fn()
  const onFooEvent2 = jest.fn()

  eventManager.addEventListener(TestEvent.FOO, onFooEvent1)

  eventManager.dispose()
  expect(Object.keys(eventManager.listeners).length).toBe(0)

  eventManager.addEventListener(TestEvent.FOO, onFooEvent2)
  eventManager.post(TestEvent.FOO, 'A')

  expect(onFooEvent1).not.toHaveBeenCalled()
  expect(onFooEvent2).not.toHaveBeenCalled()

})
