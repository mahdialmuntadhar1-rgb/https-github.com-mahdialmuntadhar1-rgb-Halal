/** Strip counterpart emails from member-facing request list rows (SEC-04 / B1). */
export function publicRequestRow(row: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...row };
  delete copy.sender_email;
  delete copy.receiver_email;
  delete copy.senderEmail;
  delete copy.receiverEmail;
  return copy;
}
