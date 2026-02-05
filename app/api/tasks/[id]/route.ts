import { NextResponse } from 'next/server';
import { patchTaskSchema } from '../../../lib/validator/task.validator';
import * as TaskService from '../../../lib/services/task.service';
import { API_ERROR_MESSAGE } from '../../../constants/apiErrors';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parseResult = patchTaskSchema.safeParse(body);

    if (!parseResult.success) {
      const first = parseResult.error.issues[0];
      return NextResponse.json(
        { error: { message: first?.message ?? API_ERROR_MESSAGE.VALIDATION_FAILED } },
        { status: 400 }
      );
    }

    const result = TaskService.updateById(id, parseResult.data);

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.task, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: { message: API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR } },
      { status: 500 }
    );
  }
}
