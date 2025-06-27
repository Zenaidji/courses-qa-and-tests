import { describe, it, expect, vi, afterEach } from "vitest";
import { createAccountInRepository } from "./account.repository";
import { createAccount } from "./account.service";

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
  };
});

describe("Acount Service", () => {
  afterEach(() => vi.clearAllMocks());
  it("should create a bank account", async () => {
    const Account = await createAccount({
      userId: 4,
      amount: 100,
    });
    expect(Account.id).toEqual(4);
    expect(Account.userId).toEqual(4);
    expect(Account.amount).toEqual(100);
  });

  it("Throw error if the user does not existe", async () => {
    await expect(
      createAccount({
        amount: 100,
      })
    ).rejects.toThrow();
  });
});
