import React, { forwardRef } from 'react';
import { LabelData, LabelType } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Barcode } from './Barcode';
import { generateQRString } from '../utils';

interface OuterLabelProps {
  data: LabelData;
  type: LabelType;
}

export const OuterLabel = forwardRef<HTMLDivElement, OuterLabelProps>(({ data, type }, ref) => {
  const qrValue = generateQRString(data, type);

  // Dimensions: 6in x 3.23in
  // 6in * 96dpi = 576px
  // 3.23in * 96dpi = 310.08px -> ~310px
  return (
    <div 
      ref={ref}
      className="bg-white text-black relative box-border overflow-hidden"
      style={{ 
        width: '576px', 
        height: '310px', 
        border: '2px solid black', // Explicit border on root
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* Inner container handles padding to avoid html2canvas clipping issues */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        padding: '8px', 
        display: 'flex', 
        flexDirection: 'column', 
        boxSizing: 'border-box'
      }}>
        
        {/* Header: Supplier Name */}
        <div style={{ 
            borderBottom: '2px solid black', 
            paddingBottom: '4px', 
            marginBottom: '4px', 
            flexShrink: 0 
        }}>
          <h1 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              textTransform: 'uppercase', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden',
              lineHeight: '1.2',
              margin: 0
          }}>
            {data.supplierName || 'Supplier / Vendor Name'}
          </h1>
        </div>

        <div className="flex flex-row flex-grow overflow-hidden">
          {/* Left Column (Main Data) */}
          <div className="flex-grow flex flex-col w-[66%] pr-1">
            
            {/* Row 1: PO & Line */}
            <div className="flex border-b border-black flex-1 min-h-0">
              <div className="w-2/3 border-r border-black pr-1 flex flex-col justify-center">
                <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2px' }}>PO Number:</div>
                <div className="flex items-center justify-start overflow-hidden">
                   <Barcode value={data.poNumber} height={12} width={1.3} fontSize={9} textAlign="left" margin={0} />
                </div>
              </div>
              <div className="w-1/3 pl-1 flex flex-col justify-center">
                <div style={{ fontSize: '9px', fontWeight: 'bold', borderBottom: '1px solid black', lineHeight: '1.1', paddingBottom: '2px', marginBottom: '2px' }}>PO Line:</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1' }}>{data.poLine}</div>
              </div>
            </div>

            {/* Row 2: HU */}
            <div className="border-b border-black flex-1 min-h-0 flex flex-col justify-center">
               <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2px' }}>HU:</div>
               <div className="flex items-center justify-start overflow-hidden">
                  <Barcode value={data.huNumber} height={12} width={1.3} fontSize={9} textAlign="left" margin={0} />
               </div>
            </div>

            {/* Row 3: IBD & Batch */}
            <div className="flex border-b border-black flex-1 min-h-0">
               <div className="w-1/2 border-r border-black pr-1 flex flex-col justify-center">
                  <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2px' }}>IBD:</div>
                  <div className="flex items-center justify-start overflow-hidden">
                     {data.ibdNumber ? <Barcode value={data.ibdNumber} height={12} width={1.3} fontSize={9} textAlign="left" margin={0} /> : <div style={{height: '24px'}}></div>}
                  </div>
               </div>
               <div className="w-1/2 pl-1 flex flex-col justify-center">
                  <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2px' }}>Batch:</div>
                  <div className="flex items-center justify-start overflow-hidden">
                    <Barcode value={data.batchNumber} height={12} width={1.3} fontSize={9} textAlign="left" margin={0} />
                  </div>
               </div>
            </div>

            {/* Row 4: PN & Qty */}
            <div className="flex border-b border-black flex-1 min-h-0">
               <div className="w-[60%] border-r border-black pr-1 flex flex-col justify-center">
                  <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2px' }}>SanDisk PN:</div>
                  <div className="flex items-center justify-start overflow-hidden">
                     <Barcode value={data.sandiskPN} height={12} width={1.3} fontSize={9} textAlign="left" margin={0} />
                  </div>
               </div>
               <div className="w-[40%] pl-1 flex flex-col justify-center">
                  <div style={{ fontSize: '9px', fontWeight: 'bold', borderBottom: '1px solid black', lineHeight: '1.1', paddingBottom: '2px', marginBottom: '2px' }}>Quantity:</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'right', paddingRight: '4px', lineHeight: '1' }}>{data.quantity}</div>
               </div>
            </div>

            {/* Row 5: MPN & DateCode */}
            <div className="flex flex-1 min-h-0">
               <div className="w-1/2 border-r border-black pr-1 flex flex-col justify-center">
                  <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2px' }}>MPN:</div>
                  <div className="flex items-center justify-start overflow-hidden">
                     <Barcode value={data.mpn} height={12} width={1.3} fontSize={9} textAlign="left" margin={0} />
                  </div>
               </div>
               <div className="w-1/2 pl-1 flex flex-col justify-center">
                  <div style={{ fontSize: '9px', fontWeight: 'bold', borderBottom: '1px solid black', lineHeight: '1.1', paddingBottom: '2px', marginBottom: '2px' }}>Date Code:</div>
                   <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1' }}>{data.dateCode}</div>
               </div>
            </div>

          </div>

          {/* Right Column (Meta & QR) */}
          <div className="w-[34%] flex flex-col pl-2 border-l border-black relative">
              
              {/* Top: QR Code */}
              <div className="flex justify-center items-start pt-1 pb-2 shrink-0">
                <QRCodeSVG 
                  value={qrValue} 
                  level="M" 
                  style={{ width: '20mm', height: '20mm' }} // Slightly reduced to ensure fit
                />
              </div>

              {/* Middle: Details */}
              <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: '1.3' }} className="flex-grow">
                 <div className="flex flex-col"><span className="underline">Vendor Lot:</span> <span className="font-normal">{data.vendorLot}</span></div>
                 <div className="flex flex-col"><span className="underline">Expiry Date:</span> <span className="font-normal">{data.expiryDate}</span></div>
                 <div>COO: <span className="font-normal">{data.coo}</span></div>
                 <div>Box No: <span className="font-normal">{data.boxNo}</span></div>
                 <div className="mt-1">Date: <span className="font-normal">{data.printDate}</span></div>
              </div>

              {/* Bottom: Substrate specifics */}
              {type === 'substrate' && (
                  <div className="mt-auto pt-1 border-t border-black flex justify-between shrink-0" style={{ fontSize: '9px', fontWeight: 'bold' }}>
                      <span>Rev: {data.rev}</span>
                      <span>Num: {data.num}</span>
                  </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
});

OuterLabel.displayName = 'OuterLabel';