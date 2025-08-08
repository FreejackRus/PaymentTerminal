import React from 'react';

export const BarcodeInput = ({ onScan, fallbackText }) => {
  const [value, setValue] = React.useState('');

  return (
    <div className={styles.wrapper}>
      <ScannerHandler onDetect={onScan} />
      <div className={styles.fallback}>
        <p>{fallbackText}</p>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onScan(value)}
        />
      </div>
    </div>
  );
};