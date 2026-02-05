import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AllTheProviders } from '../../test-utils';
import { TaskForm } from './TaskForm';
import * as tasksService from '../services/tasks.service';

jest.mock('../services/tasks.service');

const createTaskMock = tasksService.createTask as jest.MockedFunction<typeof tasksService.createTask>;

function renderWithProvider(ui: React.ReactElement) {
  return render(ui, { wrapper: AllTheProviders });
}

describe('TaskForm', () => {
  const mockOnCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls createTask with trimmed title and onCreated with result when user submits', async () => {
    const newTask = { id: '1', title: 'New task', completed: false };
    createTaskMock.mockResolvedValue(newTask);

    renderWithProvider(<TaskForm onCreated={mockOnCreated} />);

    const input = screen.getByLabelText(/task title/i);
    fireEvent.change(input, { target: { value: '  New task  ' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));

    await waitFor(() => {
      expect(createTaskMock).toHaveBeenCalledTimes(1);
      expect(createTaskMock).toHaveBeenCalledWith('New task');
    });
    expect(mockOnCreated).toHaveBeenCalledWith(newTask);
    expect(input).toHaveValue('');
  });

  it('does not call createTask when title is empty after trim', async () => {
    renderWithProvider(<TaskForm onCreated={mockOnCreated} />);

    const input = screen.getByLabelText(/task title/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));

    expect(createTaskMock).not.toHaveBeenCalled();
    expect(mockOnCreated).not.toHaveBeenCalled();
  });

  it('shows error message when createTask fails and does not call onCreated', async () => {
    createTaskMock.mockRejectedValue(new Error('Server error'));

    renderWithProvider(<TaskForm onCreated={mockOnCreated} />);

    const input = screen.getByLabelText(/task title/i);
    fireEvent.change(input, { target: { value: 'Fail task' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to create task');
    });
    expect(createTaskMock).toHaveBeenCalledWith('Fail task');
    expect(mockOnCreated).not.toHaveBeenCalled();
  });
});
