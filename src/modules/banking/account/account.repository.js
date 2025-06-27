export async function createAccountInRepository({ userId, ammount }) {
  const acounts = await sql`
    INSERT INTO accounts (userId, ammount)
    VALUES (${userId}, ${ammount})
    RETURNING *
    `;

  return acounts[0];
}

export async function getAccountsInRepository(userId) {
  const accounts = await sql`
    SELECT * FROM accounts WHERE userId = ${userId}
  `;
  return accounts;
}

export async function deleteAccountInRepository(userId) {
  const result = await sql`
    DELETE FROM accounts WHERE userId = ${userId}
  `;
  return result;
}
