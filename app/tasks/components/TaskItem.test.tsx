import { render, screen } from '@testing-library/react';
import { AllTheProviders } from '../../test-utils';
import { TaskItem } from './TaskItem';

function renderWithProvider(ui: React.ReactElement) {
  return render(ui, { wrapper: AllTheProviders });
}

describe('TaskItem', () => {
  it('renders task title and checkbox unchecked when not completed', () => {
    const task = { id: '1', title: 'Buy milk', completed: false };
    renderWithProvider(<TaskItem task={task} onToggle={() => {}} />);

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders checkbox checked when task is completed', () => {
    const task = { id: '2', title: 'Done task', completed: true };
    renderWithProvider(<TaskItem task={task} onToggle={() => {}} />);

    expect(screen.getByText('Done task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle with task id when checkbox is clicked', () => {
    const task = { id: 'task-123', title: 'Toggle me', completed: false };
    const onToggle = jest.fn();
    renderWithProvider(<TaskItem task={task} onToggle={onToggle} />);

    screen.getByRole('checkbox').click();

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('task-123');
  });

  it('calls onToggle when label is clicked', () => {
    const task = { id: 'task-456', title: 'Click label', completed: false };
    const onToggle = jest.fn();
    renderWithProvider(<TaskItem task={task} onToggle={onToggle} />);

    screen.getByLabelText(/mark "click label" as complete/i).click();

    expect(onToggle).toHaveBeenCalledWith('task-456');
  });
});
