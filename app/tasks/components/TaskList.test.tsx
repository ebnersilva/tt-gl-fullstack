import { render, screen } from '@testing-library/react';
import { AllTheProviders } from '../../test-utils';
import { TaskList } from './TaskList';

const mockTasks = [
  { id: '1', title: 'First task', completed: false },
  { id: '2', title: 'Second task', completed: true },
];

function renderWithProvider(ui: React.ReactElement) {
  return render(ui, { wrapper: AllTheProviders });
}

describe('TaskList', () => {
  it('shows empty state when there are no tasks', () => {
    renderWithProvider(<TaskList tasks={[]} onToggle={() => {}} />);
    expect(screen.getByTestId('empty-state')).toHaveTextContent(/no tasks yet/i);
  });

  it('renders all tasks with their titles', () => {
    renderWithProvider(<TaskList tasks={mockTasks} onToggle={() => {}} />);
    expect(screen.getByLabelText(/task list/i)).toBeInTheDocument();
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = jest.fn();
    renderWithProvider(<TaskList tasks={mockTasks} onToggle={onToggle} />);
    const firstCheckbox = screen.getByLabelText(/mark "first task"/i);
    firstCheckbox.click();
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
