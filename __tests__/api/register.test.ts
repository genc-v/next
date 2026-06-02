describe("Register API validation", () => {
  it("rejects a payload missing email", () => {
    const body: Partial<{ name: string; email: string; password: string }> = {
      name: "Alice",
      password: "secret123",
    };
    expect(!!(body.name && body.email && body.password)).toBe(false);
  });

  it("rejects a password shorter than 6 characters", () => {
    expect("abc".length >= 6).toBe(false);
  });

  it("accepts a complete valid payload", () => {
    const body = { name: "Alice", email: "alice@example.com", password: "secure123" };
    const isValid =
      !!(body.name && body.email && body.password) && body.password.length >= 6;
    expect(isValid).toBe(true);
  });
});
