import { Env, HttpError } from './db';

/** Returns true when either user has blocked the other in halal_blocks. */
export async function usersAreBlocked(env: Env, userIdA: string, userIdB: string): Promise<boolean> {
  const row = await env.DB.prepare(
    `SELECT 1 AS blocked FROM halal_blocks
     WHERE (blocker_id = ? AND blocked_user_id = ?)
        OR (blocker_id = ? AND blocked_user_id = ?)
     LIMIT 1`,
  )
    .bind(userIdA, userIdB, userIdB, userIdA)
    .first();
  return !!row;
}

/** Rejects interaction when a block exists in either direction. */
export async function assertUsersNotBlocked(env: Env, userIdA: string, userIdB: string): Promise<void> {
  if (await usersAreBlocked(env, userIdA, userIdB)) {
    throw new HttpError(403, 'This action is not available.');
  }
}
