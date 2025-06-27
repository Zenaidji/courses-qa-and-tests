import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTransfer, getTransfers } from "./transfer.service";

import {
  createTransferInRepository,
  getTransfersInRepository,
} from "./transfer.repository";

vi.mock("./transfer.repository.js", async () => {
  return {
    createTransferInRepository: vi.fn(
      ({ fromAccountId, toAccountId, amount }) => {
        return {
          id: 1,
          fromAccountId,
          toAccountId,
          amount,
          createdAt: new Date().toISOString(),
        };
      }
    ),
    getTransfersInRepository: vi.fn((userId) => {
      if (userId === 1) {
        return [
          {
            id: 1,
            fromAccountId: 1,
            toAccountId: 2,
            amount: 50,
            createdAt: new Date().toISOString(),
          },
        ];
      }
      throw new Error("No transfers found");
    }),
  };
});

describe("Transfer Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("createTransfer réussi", async () => {
    const transfer = await createTransfer({
      fromAccountId: 1,
      toAccountId: 2,
      amount: 100,
    });

    expect(transfer).toMatchObject({
      fromAccountId: 1,
      toAccountId: 2,
      amount: 100,
    });
  });

  it("createTransfer échoue avec de mauvais paramètres", async () => {
    await expect(
      createTransfer({
        fromAccountId: 1,
        amount: 100,
      })
    ).rejects.toThrow();
  });

  it("createTransfer échoue avec un mauvais montant", async () => {
    await expect(
      createTransfer({
        fromAccountId: 1,
        toAccountId: 2,
        amount: "cent",
      })
    ).rejects.toThrow();
  });

  it("createTransfer échoue avec une valeur négative", async () => {
    await expect(
      createTransfer({
        fromAccountId: 1,
        toAccountId: 2,
        amount: -50,
      })
    ).rejects.toThrow();
  });

  it("getTransfers réussi en vérifiant chaque élément de la liste", async () => {
    const transfers = await getTransfers(1);

    expect(Array.isArray(transfers)).toBe(true);
    expect(transfers).toHaveLength(1);
    expect(transfers[0]).toMatchObject({
      id: 1,
      fromAccountId: 1,
      toAccountId: 2,
      amount: 50,
    });
  });

  it("getTransfers échoue si l'utilisateur n'existe pas", async () => {
    await expect(getTransfers(999)).rejects.toThrow();
  });
});
