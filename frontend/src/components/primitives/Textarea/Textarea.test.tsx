/**
 * Test pentru Textarea - Componentă primitivă fără dependințe de store
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { TEST_CONSTANTS } from "@shared-constants";
import Textarea from "./Textarea";

describe("Textarea", () => {
  // Test pentru randarea de bază
  it("se randează corect", () => {
    render(<Textarea data-testid="test-textarea" />);
    expect(screen.getByTestId("test-textarea")).toBeInTheDocument();
  });

  // Test pentru placeholder
  it("afișează placeholderul corect", () => {
    render(<Textarea placeholder={TEST_CONSTANTS.TEXTAREA.PLACEHOLDER} />);
    expect(
      screen.getByPlaceholderText(TEST_CONSTANTS.TEXTAREA.PLACEHOLDER),
    ).toBeInTheDocument();
  });

  // Test pentru label
  it("afișează label-ul corect", () => {
    render(<Textarea label={TEST_CONSTANTS.TEXTAREA.LABEL} />);
    expect(screen.getByText(TEST_CONSTANTS.TEXTAREA.LABEL)).toBeInTheDocument();
  });

  // Test pentru erori
  it("afișează mesajul de eroare", () => {
    render(<Textarea error={TEST_CONSTANTS.TEXTAREA.REQUIRED_ERROR} />);
    expect(
      screen.getByText(TEST_CONSTANTS.TEXTAREA.REQUIRED_ERROR),
    ).toBeInTheDocument();
  });

  // Test pentru stilizarea corectă a erorii
  it("adaugă clasa corectă pentru borderul de eroare", () => {
    render(
      <Textarea 
        error={TEST_CONSTANTS.COMMON.ERROR_GENERIC}
        data-testid="error-textarea"
      />,
    );
    const textarea = screen.getByTestId("error-textarea");
    expect(textarea).toHaveClass("border-red-300");
  });

  // Test pentru clase personalizate pe wrapper
  it("acceptă și aplică o clasă personalizată pentru wrapper", () => {
    render(
      <Textarea 
        wrapperClassName="test-wrapper-class"
        data-testid="custom-wrapper-textarea"
      />,
    );
    const textarea = screen.getByTestId("custom-wrapper-textarea");
    expect(textarea).toBeInTheDocument();
  });

  // Test pentru clase personalizate pe textarea
  it("acceptă și aplică o clasă personalizată pentru textarea", () => {
    render(
      <Textarea 
        className="test-textarea-class"
        data-testid="custom-class-textarea"
      />
    );
    const textarea = screen.getByTestId("custom-class-textarea");
    expect(textarea).toHaveClass("test-textarea-class");
  });

  // Test pentru interacțiune
  it("permite introducerea textului", async () => {
    render(<Textarea data-testid="test-textarea" />);
    const textarea = screen.getByTestId("test-textarea");

    await userEvent.type(textarea, "Acesta este un text de test");
    expect(textarea).toHaveValue("Acesta este un text de test");
  });

  // Test pentru atribute HTML transmise
  it("permite utilizarea atributelor HTML native", () => {
    render(<Textarea data-testid="test-textarea" maxLength={100} rows={5} />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveAttribute("maxLength", "100");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  // Test pentru disabled
  it("respectă starea disabled", () => {
    render(<Textarea disabled data-testid="test-textarea" />);
    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toBeDisabled();
  });

  // Test pentru onChange
  it("apelează handlerul onChange când se introduce text", async () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} data-testid="test-textarea" />);
    const textarea = screen.getByTestId("test-textarea");

    await userEvent.type(textarea, "A");
    expect(handleChange).toHaveBeenCalled();
  });
});
