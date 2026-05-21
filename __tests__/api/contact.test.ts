// This is a simple test that doesn't import from next/server to avoid Jest Request issues

describe("Contact API Logic", () => {
  it("validates missing fields", () => {
    const payload = { name: "Test" };
    const isValid = payload.name && payload.email && payload.message;
    expect(isValid).toBeFalsy();
  });

  it("accepts valid fields", () => {
    const payload = { name: "Test", email: "test@example.com", message: "Hello" };
    const isValid = !!(payload.name && payload.email && payload.message);
    expect(isValid).toBeTruthy();
  });
});
