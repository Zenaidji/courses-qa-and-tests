import { createAccountInRepository } from "./account.repository";
import { z } from "zod";
import { HttpBadRequest, HttpForbidden } from "@httpx/exception";
const AccountSchema = z.object({
  userId: z.number(),
  amount: z.number(),
});

export async function createAccount(data) {
  const result = AccountSchema.safeParse(data);
  if (result.success) {
    return createAccountInRepository(result.data);
  } else {
    throw new HttpBadRequest(result.error);
  }
}
