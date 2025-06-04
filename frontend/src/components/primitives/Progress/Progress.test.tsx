import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from './Progress';

describe('Progress Component', () => {
  describe('Basic Rendering', () => {
    it('should render progress bar with value', () => {
      render(<Progress value={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should render with custom max value', () => {
      render(<Progress value={75} max={150} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
      expect(progressBar).toHaveAttribute('aria-valuemax', '150');
    });

    it('should apply custom className', () => {
      render(<Progress value={30} className="custom-progress" dataTestId="test-progress" />);

      expect(screen.getByTestId('test-progress')).toHaveClass('custom-progress');
    });

    it('should clamp value within bounds', () => {
      render(<Progress value={150} max={100} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should not allow negative values', () => {
      render(<Progress value={-10} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('Percentage Display', () => {
    it('should show percentage when showPercentage is true', () => {
      render(<Progress value={25} showPercentage={true} />);

      expect(screen.getByText('25.0%')).toBeInTheDocument();
    });

    it('should show value when showValue is true', () => {
      render(<Progress value={30} max={50} showValue={true} />);

      expect(screen.getByText('30 / 50')).toBeInTheDocument();
    });

    it('should show both percentage and value when both flags are true', () => {
      render(<Progress value={40} max={80} showPercentage={true} showValue={true} />);

      expect(screen.getByText('40 / 80 (50.0%)')).toBeInTheDocument();
    });

    it('should format financial values correctly', () => {
      render(
        <Progress 
          value={1500} 
          max={3000} 
          variant="financial" 
          showValue={true} 
        />
      );

      // Romanian locale formatting for currency
      expect(screen.getByText(/1\.500.*RON.*3\.000.*RON/)).toBeInTheDocument();
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      render(<Progress value={60} label="Loading..." />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toHaveClass('font-semibold');
    });

    it('should show label with percentage display', () => {
      render(
        <Progress 
          value={75} 
          label="Progress" 
          showPercentage={true} 
        />
      );

      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('75.0%')).toBeInTheDocument();
    });

    it('should show label with value display', () => {
      render(
        <Progress 
          value={20} 
          max={40} 
          label="Files uploaded" 
          showValue={true} 
        />
      );

      expect(screen.getByText('Files uploaded')).toBeInTheDocument();
      expect(screen.getByText('20 / 40')).toBeInTheDocument();
    });
  });

  describe('Label Positions', () => {
    it('should render label at top by default', () => {
      render(<Progress value={50} label="Top Label" />);

      expect(screen.getByText('Top Label')).toBeInTheDocument();
    });

    it('should render label at bottom when labelPosition is bottom', () => {
      render(<Progress value={50} label="Bottom Label" labelPosition="bottom" />);

      expect(screen.getByText('Bottom Label')).toBeInTheDocument();
    });

    it('should render inline label when labelPosition is inline', () => {
      render(<Progress value={50} label="Inline Label" labelPosition="inline" />);

      expect(screen.getByText('Inline Label')).toBeInTheDocument();
      // Check that inline layout is applied
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Variants and Sizes', () => {
    it('should apply default variant by default', () => {
      render(<Progress value={50} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should apply financial variant', () => {
      render(<Progress value={50} variant="financial" />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should apply different sizes', () => {
      const { rerender } = render(<Progress value={50} size="sm" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      rerender(<Progress value={50} size="lg" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should apply animated variant when animated is true', () => {
      render(<Progress value={50} animated={true} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Progress value={35} max={70} label="File download" />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '35');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '70');
      expect(progressBar).toHaveAttribute('aria-label', 'File download');
    });

    it('should have default aria-label when no label is provided', () => {
      render(<Progress value={25} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'Progress: 25.0%');
    });

    it('should be discoverable by screen readers', () => {
      render(<Progress value={80} label="Upload progress" />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByLabelText('Upload progress')).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render complete progress with all features', () => {
      render(
        <Progress
          value={1250}
          max={2500}
          label="Budget Progress"
          variant="financial"
          size="lg"
          animated={true}
          showPercentage={true}
          showValue={true}
          labelPosition="top"
          className="custom-progress"
          dataTestId="budget-progress"
        />
      );

      // Check all features are present
      expect(screen.getByTestId('budget-progress')).toBeInTheDocument();
      expect(screen.getByText('Budget Progress')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Check combined display
      expect(screen.getByText(/1\.250.*RON.*2\.500.*RON.*50\.0%/)).toBeInTheDocument();
      
      // Check accessibility
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '1250');
      expect(progressBar).toHaveAttribute('aria-valuemax', '2500');
      expect(progressBar).toHaveAttribute('aria-label', 'Budget Progress');
    });

    it('should handle edge cases correctly', () => {
      render(<Progress value={0} max={100} showPercentage={true} />);

      expect(screen.getByText('0.0%')).toBeInTheDocument();
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should handle 100% completion', () => {
      render(<Progress value={100} max={100} showPercentage={true} />);

      expect(screen.getByText('100.0%')).toBeInTheDocument();
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should handle decimal values correctly', () => {
      render(<Progress value={33.33} max={100} showPercentage={true} />);

      expect(screen.getByText('33.3%')).toBeInTheDocument();
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '33.33');
    });
  });
}); 