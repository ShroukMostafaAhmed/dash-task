import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders label", () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
  });

  it("applies error styling when error is provided", () => {
    render(<Input label="Field" error="Required" />);
    expect(screen.getByRole("textbox")).toHaveClass("border-red-500");
  });

  it("shows helper text when no error", () => {
    render(<Input label="Field" helperText="Enter your name" />);
    expect(screen.getByText("Enter your name")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(<Input label="Field" error="Required" helperText="Helper" />);
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });
});
