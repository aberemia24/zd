/**
 * Test pentru Alert - Componentă primitivă fără dependințe de store
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TEST_CONSTANTS } from "@shared-constants";
import Alert from "./Alert";

describe("Alert", () => {
  // Test pentru randarea de bază
  it("se randează corect cu mesajul specificat", () => {
    render(<Alert message={TEST_CONSTANTS.ALERTS.TEST_MESSAGE} />);
    expect(
      screen.getByText(TEST_CONSTANTS.ALERTS.TEST_MESSAGE),
    ).toBeInTheDocument();
  });

  // Test pentru rolul de alert pentru accesibilitate
  it("are rolul de alertă pentru accesibilitate", () => {
    render(<Alert message={TEST_CONSTANTS.COMMON.TEST_MESSAGE} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  // Teste pentru diferite tipuri de alerte - BEHAVIORAL TESTING
  it("afișează mesajul corect pentru tipul success", () => {
    render(
      <Alert type="success" message={TEST_CONSTANTS.ALERTS.SUCCESS_MESSAGE} />,
    );
    expect(
      screen.getByText(TEST_CONSTANTS.ALERTS.SUCCESS_MESSAGE),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("afișează mesajul corect pentru tipul error", () => {
    render(
      <Alert type="error" message={TEST_CONSTANTS.ALERTS.ERROR_MESSAGE} />,
    );
    expect(
      screen.getByText(TEST_CONSTANTS.ALERTS.ERROR_MESSAGE),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("afișează mesajul corect pentru tipul warning", () => {
    render(
      <Alert type="warning" message={TEST_CONSTANTS.ALERTS.WARNING_MESSAGE} />,
    );
    expect(
      screen.getByText(TEST_CONSTANTS.ALERTS.WARNING_MESSAGE),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("afișează mesajul corect pentru tipul info (default)", () => {
    render(<Alert message={TEST_CONSTANTS.ALERTS.INFO_MESSAGE} />);
    expect(
      screen.getByText(TEST_CONSTANTS.ALERTS.INFO_MESSAGE),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  // Test pentru clase personalizate - BEHAVIOR FOCUSED
  it("acceptă și funcționează cu o clasă personalizată", () => {
    render(
      <Alert
        message={TEST_CONSTANTS.ALERTS.CUSTOM_CLASS_MESSAGE}
        className="test-class"
      />,
    );
    expect(
      screen.getByText(TEST_CONSTANTS.ALERTS.CUSTOM_CLASS_MESSAGE),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  // Test pentru funcționalitate de bază - nu clase specifice
  it("funcționează corect cu toate tipurile", () => {
    const types = ["success", "error", "warning", "info"] as const;

    types.forEach((type) => {
      const { unmount } = render(
        <Alert
          type={type}
          message={TEST_CONSTANTS.ALERTS.BASE_CLASS_MESSAGE}
        />,
      );
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(TEST_CONSTANTS.ALERTS.BASE_CLASS_MESSAGE),
      ).toBeInTheDocument();
      unmount();
    });
  });
});
