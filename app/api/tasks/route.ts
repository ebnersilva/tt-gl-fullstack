import { NextResponse } from 'next/server';
import { createTaskSchema } from '../../lib/validator/task.validator';
import * as TaskService from '../../lib/services/task.service';
import { API_ERROR_MESSAGE } from '../../constants/apiErrors';

function validationError(message: string) {
  return NextResponse.json(
    { error: { message } },
    { status: 400 }
  );
}

export async function GET() {
  try {
    const tasks = TaskService.list();
    return NextResponse.json(tasks, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: { message: API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = createTaskSchema.safeParse(body);

    if (!parseResult.success) {
      const first = parseResult.error.issues[0];
      return validationError(first?.message ?? API_ERROR_MESSAGE.VALIDATION_FAILED);
    }

    const task = TaskService.create(parseResult.data);
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { message: API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR } },
      { status: 500 }
    );
  }
}
