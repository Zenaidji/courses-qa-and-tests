import {
  createAccountInRepository,
  getAccountsInRepository,
  deleteAccountInRepository,
} from "./account.repository";
import { z } from "zod";
import { HttpBadRequest, HttpForbidden } from "@httpx/exception";
import { AccountNotFoundError } from "../../../shared/errors/AccountNotFound";
import { error } from "console";
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

export async function getAccounts(userid) {
  if (userid) {
    return getAccountsInRepository(userid);
  } else {
    throw new AccountNotFoundError();
  }
}

export async function deleteAccount(userid) {
  if (userid) {
    return deleteAccountInRepository(userid);
  } else {
    throw new AccountNotFoundError();
  }
}
