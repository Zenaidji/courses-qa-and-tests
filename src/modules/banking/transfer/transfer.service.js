import {
  createTransferInRepository,
  getTransfersInRepository,
} from "./transfer.repository";
import { z } from "zod";
import { HttpBadRequest } from "@httpx/exception";

const TransferSchema = z.object({
  sourceAccountId: z.number(),
  destAccountId: z.number(),
  amount: z.number().positive(),
});

export async function createTransfer(data) {
  try {
    const validatedData = TransferSchema.parse(data);
    return await createTransferInRepository(validatedData);
  } catch (err) {
    throw new HttpBadRequest(err.message);
  }
}

export async function getTransfers(userId) {
  if (!userId) {
    throw new HttpBadRequest("userId is required");
  }
  return await getTransfersInRepository(userId);
}
