// Extinderea tipurilor Jest pentru a include matchers din @testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveValue(value: any): R;
      toBeChecked(): R;
      toBeEnabled(): R;
      toBeDisabled(): R;
      toBeVisible(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: any): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveFocus(): R;
    }
  }
}
