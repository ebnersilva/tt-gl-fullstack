import { NextResponse } from 'next/server';
import { createTodoScheme, updateTodoScheme } from '../../lib/validator/todo.validator';

import * as TodoService from '../../lib/services/todo.service';

export async function GET() {
  const todos = TodoService.list();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = createTodoScheme.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { errors: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  TodoService.create(parseResult.data);
  return NextResponse.json({ message: 'Todo created successfully' }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parseResult = updateTodoScheme.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { errors: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  TodoService.update(parseResult.data);
  return NextResponse.json({ message: 'Todo updated successfully' }, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400 }
    );
  }

  TodoService.remove(id);
  return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
}