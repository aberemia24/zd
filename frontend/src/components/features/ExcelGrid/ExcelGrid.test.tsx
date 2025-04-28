import React from 'react';
import { render, screen, within } from '@testing-library/react';
import ExcelGrid, { MonthlyData } from './ExcelGrid';
import { EXCEL_GRID } from 'shared-constants';

// Date de test
const mockData: MonthlyData[] = [
  {
    luna: 'Ianuarie',
    venituri: 5000,
    cheltuieli: 3500,
    economii: 1500,
    sold: 1500
  },
  {
    luna: 'Februarie',
    venituri: 5200,
    cheltuieli: 3700,
    economii: 1500,
    sold: 3000
  }
];

describe('ExcelGrid', () => {
  it('afișează mesajul de încărcare când loading este true', () => {
    render(<ExcelGrid data={[]} loading={true} />);
    
    expect(screen.getByTestId('excel-grid-loading')).toBeInTheDocument();
    expect(screen.getByText(EXCEL_GRID.LOADING)).toBeInTheDocument();
  });

  it('afișează mesajul de date indisponibile când nu există date', () => {
    render(<ExcelGrid data={[]} />);
    
    expect(screen.getByTestId('excel-grid-no-data')).toBeInTheDocument();
    expect(screen.getByText(EXCEL_GRID.NO_DATA)).toBeInTheDocument();
  });

  it('afișează grid-ul cu header-uri când există date', () => {
    render(<ExcelGrid data={mockData} />);
    
    // Verifică existența header-urilor
    Object.values(EXCEL_GRID.HEADERS).forEach(headerText => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  it('afișează corect datele din array-ul furnizat', () => {
    const { container } = render(<ExcelGrid data={mockData} />);
    
    // Extragem toate celulele din grid în ordinea lor
    const cells = container.querySelectorAll('.excel-cell');
    
    // Verificăm datele primei luni (primele 5 celule)
    expect(cells[0]).toHaveTextContent(mockData[0].luna);
    expect(cells[1]).toHaveTextContent(mockData[0].venituri.toString());
    expect(cells[2]).toHaveTextContent(mockData[0].cheltuieli.toString());
    expect(cells[3]).toHaveTextContent(mockData[0].economii.toString());
    expect(cells[4]).toHaveTextContent(mockData[0].sold.toString());
    
    // Verificăm datele celei de-a doua luni (următoarele 5 celule)
    expect(cells[5]).toHaveTextContent(mockData[1].luna);
    expect(cells[6]).toHaveTextContent(mockData[1].venituri.toString());
    expect(cells[7]).toHaveTextContent(mockData[1].cheltuieli.toString());
    expect(cells[8]).toHaveTextContent(mockData[1].economii.toString());
    expect(cells[9]).toHaveTextContent(mockData[1].sold.toString());
  });

  it('aplică clasele CSS corecte pentru stilizare', () => {
    const { container } = render(<ExcelGrid data={mockData} />);
    
    // Verifică stilizarea containerului
    const gridContainer = container.querySelector('.overflow-x-auto');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('shadow-md');
    expect(gridContainer).toHaveClass('rounded-lg');
    
    // Verifică stilizarea header-urilor
    const headers = container.querySelectorAll('.excel-header');
    expect(headers.length).toBe(5); // 5 coloane de header
    
    // Verifică stilizarea celulelor
    const dataCells = container.querySelectorAll('.excel-cell');
    expect(dataCells.length).toBe(10); // 2 rânduri x 5 celule
    
    // Extragem toate celulele din grid pentru verificarea claselor specifice
    const cells = container.querySelectorAll('.excel-cell');
    
    // Verificăm clasele pentru tipurile de tranzacții - folosind indecșii pentru accesare directă
    const incomeCell = cells[1]; // Prima celulă de venituri
    expect(incomeCell).toHaveClass('text-income');
    
    const expenseCell = cells[2]; // Prima celulă de cheltuieli
    expect(expenseCell).toHaveClass('text-expense');
    
    const savingCell = cells[3]; // Prima celulă de economii
    expect(savingCell).toHaveClass('text-saving');
  });

  it('acceptă și aplică className personalizat în container', () => {
    const customClass = 'test-custom-class';
    const { container } = render(<ExcelGrid data={mockData} className={customClass} />);
    
    const gridContainer = container.querySelector('.overflow-x-auto');
    expect(gridContainer).toHaveClass(customClass);
  });
});
