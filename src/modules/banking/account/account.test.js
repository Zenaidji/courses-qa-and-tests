import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  createAccountInRepository,
  getAccountsInRepository,
  deleteAccountInRepository,
} from "./account.repository";
import { createAccount, getAccounts, deleteAccount } from "./account.service";

vi.mock("./account.repository.js", async () => {
  const actual = await vi.importActual("./account.repository");
  return {
    ...actual,

    createAccountInRepository: vi.fn((data) => {
      return {
        id: 4,
        userId: 4,
        amount: 100,
      };
    }),
    getAccountsInRepository: vi.fn((userId) => {
      if (userId === 4) {
        return {
          id: 4,
          userId: 4,
          amount: 100,
        };
      }
      throw new Error("Account not found");
    }),
    deleteAccountInRepository: vi.fn((userId) => {
      if (userId === 4) {
        return { count: 1 };
      }
      throw new Error("Account not found");
    }),
  };
});

describe("Account Service", () => {
  let account;
  beforeEach(async () => {
    account = await createAccount({
      userId: 4,
      amount: 100,
    });
  });

  afterEach(() => vi.clearAllMocks());

  it("should create a bank account", async () => {
    expect(account.id).toEqual(4);
    expect(account.userId).toEqual(4);
    expect(account.amount).toEqual(100);
  });

  it("should get existing account", async () => {
    await expect(getAccounts(account.userId)).resolves.toEqual({
      id: 4,
      userId: 4,
      amount: 100,
    });
  });

  it("should delete existing account", async () => {
    await expect(deleteAccount(account.userId)).resolves.toEqual({ count: 1 });
  });

  it("should throw error when creating account for a user without userId", async () => {
    await expect(
      createAccount({
        amount: 100,
      })
    ).rejects.toThrow();
  });

  it("should throw error when getting account for a user that does not exist", async () => {
    await expect(getAccounts(999)).rejects.toThrow("Account not found");
  });

  it("should throw error when deleting an account that does not exist", async () => {
    await expect(deleteAccount(999)).rejects.toThrow("Account not found");
  });
});
