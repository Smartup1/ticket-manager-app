import { getApiClient } from '@/services/api-client/api';
import { render } from '@testing-library/react-native';
import { AxiosInstance } from 'axios';
import React from 'react';
import { Text } from 'react-native';
import { ApiProvider, useApi } from '../api-client-context';

jest.mock('@/services/api-client/api');

const mockGetApiClient = jest.mocked(getApiClient);

const mockApiClient = { baseURL: '/test', defaults: {} } as unknown as AxiosInstance;

const TestConsumer = () => {
  const api = useApi();
  return <Text>{JSON.stringify(api)}</Text>;
};

describe('ApiProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetApiClient.mockReturnValue(mockApiClient);
  });

  it('provides the api client to its children', () => {
    const { getByText } = render(
      <ApiProvider>
        <TestConsumer />
      </ApiProvider>
    );

    expect(getByText(JSON.stringify(mockApiClient))).toBeTruthy();
    expect(mockGetApiClient).toHaveBeenCalledTimes(1);
  });

  it('creates the api client only once per mount', () => {
    const { rerender } = render(
      <ApiProvider>
        <TestConsumer />
      </ApiProvider>
    );

    mockGetApiClient.mockClear();

    rerender(
      <ApiProvider>
        <TestConsumer />
      </ApiProvider>
    );

    expect(mockGetApiClient).not.toHaveBeenCalled();
  });

  it('memoizes the api client against re-renders', () => {
    const apiRef = { current: undefined as typeof mockApiClient | undefined };
    const CaptureApi = () => {
      apiRef.current = useApi();
      return null;
    };

    const { rerender } = render(
      <ApiProvider>
        <CaptureApi />
      </ApiProvider>
    );

    const firstApi = apiRef.current;

    rerender(
      <ApiProvider>
        <CaptureApi />
      </ApiProvider>
    );

    expect(apiRef.current).toBe(firstApi);
  });
});

describe('useApi', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetApiClient.mockReturnValue(mockApiClient);
  });

  it('returns the api client when used inside ApiProvider', () => {
    let capturedApi;
    const CaptureApi = () => {
      capturedApi = useApi();
      return null;
    };

    render(
      <ApiProvider>
        <CaptureApi />
      </ApiProvider>
    );

    expect(capturedApi).toBe(mockApiClient);
  });

  it('throws an error when used outside ApiProvider', () => {
    const FaultyComponent = () => {
      useApi();
      return null;
    };

    expect(() => render(<FaultyComponent />)).toThrow(
      'useApi must be used within an ApiProvider'
    );
  });
});