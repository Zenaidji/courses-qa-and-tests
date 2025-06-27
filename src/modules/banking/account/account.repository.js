export async function createAccountInRepository({ userId, ammount }) {
  const acounts = await sql`
    INSERT INTO accounts (userId, ammount)
    VALUES (${userId}, ${birthammountday})
    RETURNING *
    `;

  return acounts[0];
}
