import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stars } from "./Stars.jsx";

describe("Stars", () => {
  it("membulatkan rating", () => {
    render(<Stars rating={4.6} />);
    expect(screen.getByLabelText("Rating 4.6")).toHaveTextContent("★★★★★");
  });
});
