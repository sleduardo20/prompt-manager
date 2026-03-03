import { render, screen } from "@/lib/test-utils";

describe("Example", () => {
  it("should be able", () => {
    render(<div>Teste</div>);

    expect(screen.getByText("Teste")).toBeInTheDocument();
  });
});
