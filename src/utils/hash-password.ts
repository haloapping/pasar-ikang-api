export async function hashPassword(password: string) {
  return await Bun.password.hash(password, {
    algorithm: "argon2id",
  });
}
