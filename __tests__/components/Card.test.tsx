import { render, screen } from "@testing-library/react";
import Card from "@/components/Card";

describe("Card Component", () => {
  it("renders the title and children", () => {
    render(
      <Card title="Test Card">
        <p>Card Content</p>
      </Card>
    );
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });
});
