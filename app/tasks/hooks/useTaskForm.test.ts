import { renderHook, act, waitFor } from '@testing-library/react';
import { AllTheProviders } from '../../test-utils';
import { useTaskForm } from './useTaskForm';
import * as tasksService from '../services/tasks.service';

jest.mock('../services/tasks.service');

const wrapper = AllTheProviders;

const createTaskMock = tasksService.createTask as jest.MockedFunction<typeof tasksService.createTask>;

describe('useTaskForm', () => {
  const mockOnCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useTaskForm(mockOnCreated), { wrapper });

    expect(result.current.title).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('setTitle updates title', () => {
    const { result } = renderHook(() => useTaskForm(mockOnCreated), { wrapper });

    act(() => {
      result.current.setTitle('New task');
    });

    expect(result.current.title).toBe('New task');
  });

  it('handleSubmit calls createTask with trimmed title and onCreated with result', async () => {
    const newTask = { id: '1', title: 'Trimmed', completed: false };
    createTaskMock.mockResolvedValue(newTask);

    const { result } = renderHook(() => useTaskForm(mockOnCreated), { wrapper });

    act(() => {
      result.current.setTitle('  Trimmed  ');
    });

    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    await waitFor(() => {
      expect(createTaskMock).toHaveBeenCalledWith('Trimmed');
    });

    expect(mockOnCreated).toHaveBeenCalledWith(newTask);
    expect(result.current.title).toBe('');
    expect(result.current.error).toBeNull();
  });

  it('handleSubmit does nothing when title is empty after trim', async () => {
    const { result } = renderHook(() => useTaskForm(mockOnCreated), { wrapper });

    act(() => {
      result.current.setTitle('   ');
    });

    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(createTaskMock).not.toHaveBeenCalled();
    expect(mockOnCreated).not.toHaveBeenCalled();
  });

  it('sets error when createTask fails and does not call onCreated', async () => {
    createTaskMock.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useTaskForm(mockOnCreated), { wrapper });

    act(() => {
      result.current.setTitle('Fail');
    });

    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to create task');
    });

    expect(createTaskMock).toHaveBeenCalledWith('Fail');
    expect(mockOnCreated).not.toHaveBeenCalled();
  });
});
