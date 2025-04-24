import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  // Test pentru randarea de bază
  it('se randează corect cu conținutul specificat', () => {
    render(<Badge>Activ</Badge>);
    expect(screen.getByText('Activ')).toBeInTheDocument();
  });

  // Teste pentru diferite culori și clasele lor CSS
  it('aplică clasa corectă pentru culoarea primary (implicită)', () => {
    const { container } = render(<Badge>Primary Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-white');
  });

  it('aplică clasa corectă pentru culoarea success', () => {
    const { container } = render(<Badge color="success">Success Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-green-500');
    expect(badge).toHaveClass('text-white');
  });

  it('aplică clasa corectă pentru culoarea error', () => {
    const { container } = render(<Badge color="error">Error Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-red-500');
    expect(badge).toHaveClass('text-white');
  });

  it('aplică clasa corectă pentru culoarea warning', () => {
    const { container } = render(<Badge color="warning">Warning Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-yellow-400');
    expect(badge).toHaveClass('text-black');
  });

  it('aplică clasa corectă pentru culoarea info', () => {
    const { container } = render(<Badge color="info">Info Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-blue-500');
    expect(badge).toHaveClass('text-white');
  });

  // Test pentru clase personalizate
  it('acceptă și aplică o clasă personalizată', () => {
    const { container } = render(<Badge className="test-class">Custom Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('test-class');
  });

  // Test pentru verificarea că clasele de bază sunt aplicate în toate cazurile
  it('menține clasele de bază indiferent de culoare', () => {
    const { container } = render(<Badge>Base Classes</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('inline-block');
    expect(badge).toHaveClass('px-2');
    expect(badge).toHaveClass('py-0.5');
    expect(badge).toHaveClass('rounded');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-semibold');
  });

  // Test pentru acceptarea de conținut complex (nu doar text)
  it('acceptă elemente React ca și copii', () => {
    render(
      <Badge>
        <span data-testid="child-element">Conținut complex</span>
      </Badge>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
});
