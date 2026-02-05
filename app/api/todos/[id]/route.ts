import { NextResponse } from 'next/server';
import { updateTodoScheme } from '../../../lib/validator/todo.validator';

import * as TodoService from '../../../lib/services/todo.service';

type Params = {
  params: {
    id: string;
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const parseResult = updateTodoScheme.omit({ id: true }).safeParse(body);

  const { id } = await params;

  if (!parseResult.success) {
    return NextResponse.json(
      { errors: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const result = TodoService.update({
    ...parseResult.data,
    id,
  });

  if (result?.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status || 500 }
    );
  }

  return NextResponse.json({ message: 'Todo updated successfully' }, { status: 200 });
}