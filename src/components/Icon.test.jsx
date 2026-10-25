import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon.jsx";

describe("Icon", () => {
  it("merender ikon", () => {
    const { container } = render(<Icon name="bag" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
