import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';

export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  // Efecte vizuale rafinate
  withShadow?: boolean;
  withGradient?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  dataTestId,
  orientation = 'horizontal',
  spacing = 'md',
  align = 'start',
  withShadow = false,
  withGradient = false,
}) => {
  // Colectăm efectele vizuale aplicate
  const effects: string[] = [];
  if (withShadow) {
    effects.push('group-shadow');
  }
  if (withGradient) {
    effects.push('group-gradient');
  }

  // Clasele pentru spacing
  const spacingClasses = {
    'none': orientation === 'horizontal' ? 'space-x-0' : 'space-y-0',
    'sm': orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
    'md': orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    'lg': orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
  };

  // Clasele pentru aliniere
  const alignClasses = {
    'start': 'justify-start',
    'center': 'justify-center',
    'end': 'justify-end',
    'between': 'justify-between',
    'around': 'justify-around',
    'evenly': 'justify-evenly',
  };

  // Orientare
  const orientationClass = orientation === 'horizontal' ? 'flex flex-row' : 'flex flex-col';

  return (
    <div
      className={classNames(
        getEnhancedComponentClasses('button-group', undefined, undefined, undefined, effects),
        orientationClass,
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      data-testid={dataTestId || 'button-group'}
    >
      {React.Children.map(children, (child, index) => {
        // Aplicăm stiluri specifice pentru butoanele din grup
        if (React.isValidElement(child)) {
          // În loc să verificăm după nume, verificăm după prezența anumitor proprietăți
          // care sunt caracteristice componentelor noastre de tip buton
          const isButtonLike = 
            'variant' in child.props && 
            'size' in child.props;
          
          if (isButtonLike) {
            const childrenCount = React.Children.count(children);
            const isFirst = index === 0;
            const isLast = index === childrenCount - 1;

            return React.cloneElement(child, {
              ...child.props,
              className: classNames(
                child.props.className,
                'button-group-item',
                {
                  'first-item': isFirst,
                  'last-item': isLast,
                }
              ),
            });
          }
        }
        return child;
      })}
    </div>
  );
};

export default ButtonGroup;
