import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import xlsx from "node-xlsx";

vi.mock("node-xlsx", async () => {
  const actual = await vi.importActual("node-xlsx");
  return {
    ...actual,
    default: {
      ...actual.default,
      build: vi.fn((data) => data),
    },
  };
});
describe("test le fonctionnment de node-xlsx", () => {
  afterEach(() => vi.clearAllMocks());
  const data = "fake data";

  it("test build avec les bon arguments", async () => {
    const res = xlsx.build(data);
    expect(xlsx.build).toBeCalledWith(data);
    expect(res).toBe(res);
  });
});
