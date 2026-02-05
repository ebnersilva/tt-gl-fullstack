import {

} from '../services/todos.service';


// Refactor types to another folder to separate types
export function TodoItem({ todo, onToggle, onDelete }: { todo: { id: string; title: string; completed: boolean }; onToggle: (id: string) => void; onDelete: (id: string) => void; }) {
  
  
  return (
    <>Todo Item</>
  )
}
