import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    __esModule: true,
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    expect(mockOne).not.toBeCalled();
    expect(mockTwo).not.toBeCalled();
    expect(mockThree).not.toBeCalled();
  });

  test('unmockedFunction should log into console', () => {
    const log = jest
      .spyOn(console, 'log')
      .mockImplementation(() => 'I am not mocked');
    unmockedFunction();
    expect(log).toBeCalled();
  });
});
