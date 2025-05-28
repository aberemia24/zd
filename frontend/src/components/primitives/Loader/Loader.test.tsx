/**
 * Test pentru Loader - Componentă primitivă fără dependințe de store
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loader from "./Loader";
import { LOADER } from "@shared-constants";

describe("Loader", () => {
  // Test pentru randarea de bază
  it("se randează corect cu textul din constants/ui.ts", () => {
    render(<Loader />);
    // Verificăm că se folosește textul centralizat din constants/ui.ts
    expect(screen.getByTestId("loader-text")).toHaveTextContent(LOADER.TEXT);
  });

  // Test pentru prezența SVG-ului de animație
  it("conține elementul SVG de animație", () => {
    render(<Loader />);
    const svg = screen.getByTestId("loader-svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");
  });

  // Test pentru clasele CSS
  it("conține clasele CSS corecte pentru container", () => {
    render(<Loader />);
    const loaderContainer = screen.getByTestId("loader-container");
    expect(loaderContainer).toHaveClass("flex");
    expect(loaderContainer).toHaveClass("justify-center");
    expect(loaderContainer).toHaveClass("items-center");
  });

  // Test pentru accesibilitate - prezența elementului text pentru screenreaders
  it("conține text pentru accesibilitate", () => {
    render(<Loader />);
    const textElement = screen.getByTestId("loader-text");
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass("text-secondary-700");
  });

  // Test pentru structura corectă a animației
  it("conține elementele corecte pentru animația de loading", () => {
    render(<Loader />);
    // Use data-testid instead of role
    const svg = screen.getByTestId("loader-svg");
    expect(svg).toBeInTheDocument();
    
    // Check for animation classes
    expect(svg).toHaveClass("animate-spin");
  });
});
