import { render, screen, fireEvent } from "@testing-library/react";
import UrlForm from "@/components/UrlForm";

describe("UrlForm", () => {
  it("renders the URL input field", () => {
    render(<UrlForm onUrlCreated={jest.fn()} />);
    expect(
      screen.getByPlaceholderText(/https:\/\/example\.com/i)
    ).toBeInTheDocument();
  });

  it("renders the shorten button", () => {
    render(<UrlForm onUrlCreated={jest.fn()} />);
    expect(screen.getByText("Shorten Link")).toBeInTheDocument();
  });

  it("submit button is disabled when input is empty", () => {
    render(<UrlForm onUrlCreated={jest.fn()} />);
    const button = screen.getByText("Shorten Link").closest("button")!;
    expect(button).toBeDisabled();
  });

  it("submit button is enabled after typing a URL", () => {
    render(<UrlForm onUrlCreated={jest.fn()} />);
    const input = screen.getByPlaceholderText(/https:\/\/example\.com/i);
    fireEvent.change(input, { target: { value: "https://example.com" } });
    const button = screen.getByText("Shorten Link").closest("button")!;
    expect(button).not.toBeDisabled();
  });
});
