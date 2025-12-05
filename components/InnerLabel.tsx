import React, { forwardRef } from 'react';
import { LabelData, LabelType } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Barcode } from './Barcode';
import { generateQRString } from '../utils';

interface InnerLabelProps {
  data: LabelData;
  type: LabelType;
}

export const InnerLabel = forwardRef<HTMLDivElement, InnerLabelProps>(({ data, type }, ref) => {
  const qrValue = generateQRString(data, type);

  // Dimensions: 3.1in x 1.6in
  // 3.1in * 96 = 297.6px -> 298px
  // 1.6in * 96 = 153.6px -> 154px
  return (
    <div 
      ref={ref}
      className="bg-white text-black relative box-border overflow-hidden"
      style={{ 
        width: '298px', 
        height: '154px', 
        border: '1px solid #d1d5db', // Light gray border for inner label
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* Inner container for padding safety */}
      <div style={{
          width: '100%',
          height: '100%',
          padding: '4px',
          display: 'flex',
          boxSizing: 'border-box'
      }}>
        {/* Left Side: Barcodes and Main Info */}
        <div className="w-[65%] flex flex-col justify-between pr-1">
            
            {/* HU Barcode */}
            <div className="mb-0.5">
                <div className="flex items-baseline mb-0.5">
                    <span style={{fontSize: '7px', fontWeight: 'bold', marginRight: '2px', lineHeight: '1'}}>HU:</span>
                    <span style={{fontSize: '7px', lineHeight: '1'}}>{data.huNumber}</span>
                </div>
                <div className="flex overflow-hidden">
                    <Barcode value={data.huNumber} height={9} width={1} fontSize={0} displayValue={false} textAlign="left" margin={0} />
                </div>
            </div>

            {/* PN Barcode */}
            <div className="mb-0.5">
                <div className="flex items-baseline mb-0.5">
                    <span style={{fontSize: '7px', fontWeight: 'bold', marginRight: '2px', lineHeight: '1'}}>PN:</span>
                    <span style={{fontSize: '7px', lineHeight: '1'}}>{data.sandiskPN}</span>
                </div>
                <div className="flex overflow-hidden">
                    <Barcode value={data.sandiskPN} height={9} width={1} fontSize={0} displayValue={false} textAlign="left" margin={0} />
                </div>
            </div>
            
            {/* Text Fields Grid */}
            <div className="grid grid-cols-1 gap-0" style={{ fontSize: '6px', lineHeight: '1.2'}}>
                <div className="truncate"><span className="font-bold">V/Lot:</span> {data.vendorLot}</div>
                <div className="truncate"><span className="font-bold">MPN:</span> {data.mpn}</div>
                <div className="truncate"><span className="font-bold">DC:</span> {data.dateCode}</div>
                <div className="truncate"><span className="font-bold">Exp Date:</span> {data.expiryDate}</div>
                <div className="truncate"><span className="font-bold">IBD:</span> {data.ibdNumber}</div>
            </div>

        </div>

        {/* Right Side: PO, Batch, QR */}
        <div className="w-[35%] flex flex-col border-l border-black pl-1 justify-between">
            {/* Top Right Text */}
            <div style={{ fontSize: '6px', lineHeight: '1.2'}} className="space-y-0.5">
                <div className="flex justify-between">
                    <span className="font-bold">PO. No.:</span>
                    <span>{data.poNumber}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="font-bold">PO Line:</span>
                    <span>{data.poLine}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="font-bold">Batch:</span>
                    <span>{data.batchNumber}</span>
                </div>
            </div>
            
            {/* QR Section */}
            <div className="flex-grow flex items-center justify-center my-1">
                 <QRCodeSVG value={qrValue} size={36} level="M" />
            </div>

             {/* Bottom Right Info */}
             <div style={{ fontSize: '6px', lineHeight: '1.2'}} className="space-y-0.5">
                <div className="flex justify-between">
                    <span className="font-bold">MSL:</span>
                    <span>{data.msl}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">COO:</span>
                    <span>{data.coo}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Qty:</span>
                    <span>{data.quantity}</span>
                </div>
                {type === 'substrate' && (
                    <>
                        <div className="flex justify-between font-bold">
                            <span>Rev:</span>
                            <span>{data.rev}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Num:</span>
                            <span>{data.num}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
});

InnerLabel.displayName = 'InnerLabel';