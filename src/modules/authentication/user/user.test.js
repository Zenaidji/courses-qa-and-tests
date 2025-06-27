import { describe, it, expect, vi, afterEach } from "vitest";
import { createUser, MAX_USER_AGE } from "./user.service";
import { createUserInRepository } from "./user.repository";
import { HttpBadRequest, HttpForbidden } from "@httpx/exception";

vi.mock("./user.repository", async () => {
  const actual = await vi.importActual("./user.repository");
  return {
    ...actual,
    createUserInRepository: vi.fn((data) => {
      return {
        id: 4,
        name: data.name,
        birthday: data.birthday,
      };
    }),
  };
});

describe("User Service", () => {
  afterEach(() => vi.clearAllMocks());
  it("should create a user", async () => {
    const user = await createUser({
      name: "Valentin R",
      birthday: new Date(1997, 8, 13),
    });
    expect(user.id).toBeDefined();
    expect(user.id).toBeTypeOf("number");
    expect(user).toHaveProperty("name", "Valentin R");
    expect(user.birthday).toBeDefined();
    expect(user.birthday.getFullYear()).toBe(1997);
    expect(user.birthday.getMonth()).toBe(8);
    expect(createUserInRepository).toBeCalledTimes(1);
    expect(createUserInRepository).toBeCalledWith({
      name: "Valentin R",
      birthday: new Date(1997, 8, 13),
    });
  });

  it("should trigger a bad request error when user creation", async () => {
    await expect(createUser({ name: "Valentin R" })).rejects.toThrow(
      HttpBadRequest
    );
  });
  it("should trigger  HttpForbidden Error when user is too young ", async () => {
    await expect(
      createUser({ name: "Valentin R", birthday: new Date(2008, 1, 1) })
    ).rejects.toThrow(HttpForbidden);
  });
});
