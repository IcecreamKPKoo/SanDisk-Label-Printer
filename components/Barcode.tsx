import React from 'react';
import ReactBarcode from 'react-barcode';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  fontSize?: number;
  displayValue?: boolean;
  margin?: number;
  textAlign?: "center" | "left" | "right";
}

export const Barcode: React.FC<BarcodeProps> = ({ 
  value, 
  width = 1.3, 
  height = 20, 
  fontSize = 9, 
  displayValue = true,
  margin = 0,
  textAlign = "center"
}) => {
  if (!value) return <div className="text-xs text-gray-400 italic">No Data</div>;

  return (
    // display: block ensures the div takes up space correctly in flex containers
    <div style={{ lineHeight: 0, display: 'block' }}>
        <ReactBarcode 
        value={value}
        format="CODE128"
        width={width}
        height={height}
        displayValue={displayValue}
        font="Arial"
        fontSize={fontSize}
        margin={margin}
        textAlign={textAlign}
        background="transparent"
        textMargin={2} // Slightly increased to prevent text hitting bars
        />
    </div>
  );
};