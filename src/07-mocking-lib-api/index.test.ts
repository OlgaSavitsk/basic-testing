import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  return {
    __esModule: true,
    throttle: jest.fn((fn) => fn),
  };
});

const path = 'todos';

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const create = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(path);
    expect(create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    jest.spyOn(axios, 'create').mockImplementationOnce(() => axios);
    const get = jest.spyOn(axios, 'get').mockResolvedValueOnce({});
    await throttledGetDataFromApi(path);
    expect(get).toBeCalledWith(path);
  });

  test('should return response data', async () => {
    const response = await throttledGetDataFromApi(path);
    expect(typeof response).toBe('object');
  });
});
