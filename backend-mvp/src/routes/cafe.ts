import { HttpError, json, readJson, RequestContext, requireString, requireUser, uuid } from '../db';

export async function handleCafe(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  const path = url.pathname.replace(/^\/api(?=\/)/, '');
  const user = requireUser(ctx);

  if (path === '/cafe/today' && request.method === 'GET') {
    const question = await env.DB.prepare(
      `SELECT id, question, question_ar, category, active_date
       FROM halal_cafe_questions
       WHERE active_date <= date('now')
       ORDER BY active_date DESC, created_at DESC
       LIMIT 1`,
    ).first<Record<string, unknown>>();

    if (!question) {
      return json({
        question: null,
        answered: false,
      });
    }

    const answer = await env.DB.prepare(
      'SELECT id, answer, created_at FROM halal_cafe_answers WHERE question_id = ? AND user_id = ?',
    )
      .bind(question.id, user.id)
      .first<Record<string, unknown>>();

    return json({
      question,
      answered: Boolean(answer),
      answer,
    });
  }

  if (path === '/cafe/answer' && request.method === 'POST') {
    const body = await readJson(request);
    const questionId = requireString(body, 'questionId', 80);
    const answer = requireString(body, 'answer', 2000);

    const question = await env.DB.prepare('SELECT id FROM halal_cafe_questions WHERE id = ?').bind(questionId).first();
    if (!question) throw new HttpError(404, 'Cafe question not found.');

    const id = uuid();
    await env.DB.prepare(
      `INSERT INTO halal_cafe_answers (id, question_id, user_id, answer, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(question_id, user_id) DO UPDATE SET
         answer = excluded.answer,
         updated_at = CURRENT_TIMESTAMP`,
    )
      .bind(id, questionId, user.id, answer)
      .run();

    const saved = await env.DB.prepare(
      'SELECT id, question_id, user_id, answer, created_at, updated_at FROM halal_cafe_answers WHERE question_id = ? AND user_id = ?',
    )
      .bind(questionId, user.id)
      .first();
    return json({ answer: saved }, 201);
  }

  return null;
}

