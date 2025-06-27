import { sql } from "./db.js";

export async function createTransferInRepository({
  sourceAccountId,
  destAccountId,
  amount,
}) {
  return await sql.begin(async (tx) => {
    const [sourceAccount] = await tx`
      SELECT * FROM accounts WHERE id = ${sourceAccountId}
    `;
    const [destAccount] = await tx`
      SELECT * FROM accounts WHERE id = ${destAccountId}
    `;

    if (!sourceAccount || !destAccount) {
      throw new Error("Source or destination account not found");
    }

    if (sourceAccount.amount < amount) {
      throw new Error("Insufficient funds");
    }

    await tx`
      UPDATE accounts SET amount = amount - ${amount}
      WHERE id = ${sourceAccountId}
    `;

    await tx`
      UPDATE accounts SET amount = amount + ${amount}
      WHERE id = ${destAccountId}
    `;

    const [transfer] = await tx`
      INSERT INTO transfers (sourceAccountId, destAccountId, amount)
      VALUES (${sourceAccountId}, ${destAccountId}, ${amount})
      RETURNING *
    `;

    return transfer;
  });
}

export async function getTransfersInRepository(userId) {
  const result = await sql`
    SELECT t.*
    FROM transfers t
    JOIN accounts sa ON t.sourceAccountId = sa.id
    JOIN accounts da ON t.destAccountId = da.id
    WHERE sa.userId = ${userId} OR da.userId = ${userId}
  `;
  return result;
}
