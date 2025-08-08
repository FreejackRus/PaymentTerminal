import { render, fireEvent } from '@testing-library/react';

describe('BarcodeInput', () => {
  test('handles manual input', () => {
    const mockScan = jest.fn();
    const { getByPlaceholderText } = render(
      <BarcodeInput onScan={mockScan} />
    );
    
    fireEvent.change(getByPlaceholderText('Штрих-код'), 
      { target: { value: '019278296' }}
    );
    fireEvent.keyPress(input, { key: 'Enter', code: 13 });
    
    expect(mockScan).toHaveBeenCalledWith('019278296');
  });
});