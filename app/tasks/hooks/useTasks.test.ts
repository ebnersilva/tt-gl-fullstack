import { renderHook, act, waitFor } from '@testing-library/react';
import { AllTheProviders } from '../../test-utils';
import { useTasks } from './useTasks';
import * as tasksService from '../services/tasks.service';

jest.mock('../services/tasks.service');

const wrapper = AllTheProviders;

const fetchTasksMock = tasksService.fetchTasks as jest.MockedFunction<typeof tasksService.fetchTasks>;
const updateTaskMock = tasksService.updateTask as jest.MockedFunction<typeof tasksService.updateTask>;

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchTasksMock.mockResolvedValue([]);
  });

  it('loads tasks on mount and sets loading then tasks', async () => {
    const initialTasks = [
      { id: '1', title: 'First', completed: false },
      { id: '2', title: 'Second', completed: true },
    ];
    fetchTasksMock.mockResolvedValue(initialTasks);

    const { result } = renderHook(() => useTasks(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(fetchTasksMock).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tasks).toEqual(initialTasks);
    expect(result.current.error).toBeNull();
  });

  it('sets error when fetchTasks fails', async () => {
    fetchTasksMock.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load tasks');
    expect(result.current.tasks).toEqual([]);
  });

  it('handleCreated adds task to the list', async () => {
    fetchTasksMock.mockResolvedValue([]);
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newTask = { id: 'new-1', title: 'New task', completed: false };

    act(() => {
      result.current.handleCreated(newTask);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]).toEqual(newTask);
  });

  it('handleToggle updates task optimistically and reverts on API error', async () => {
    const initialTasks = [{ id: '1', title: 'One', completed: false }];
    fetchTasksMock.mockResolvedValue(initialTasks);

    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    updateTaskMock.mockRejectedValue(new Error('Server error'));

    await act(async () => {
      await result.current.handleToggle('1');
    });

    expect(result.current.tasks[0].completed).toBe(false);
    expect(result.current.error).toBe('Failed to update task');
  });

  it('loadTasks can be called to retry after error', async () => {
    fetchTasksMock.mockRejectedValueOnce(new Error('First fail'));
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load tasks');
    });

    fetchTasksMock.mockResolvedValue([{ id: '1', title: 'Ok', completed: false }]);

    await act(async () => {
      await result.current.loadTasks();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.tasks).toHaveLength(1);
    expect(fetchTasksMock).toHaveBeenCalledTimes(2);
  });
});
