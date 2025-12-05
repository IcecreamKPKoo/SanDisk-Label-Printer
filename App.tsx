import React, { useState, useEffect, useRef } from 'react';
import { Settings, FileText, Download, RefreshCw } from 'lucide-react';
import { LabelData, LabelSize, initialLabelData } from './types';
import { OuterLabel } from './components/OuterLabel';
import { InnerLabel } from './components/InnerLabel';
import { getYYWW } from './utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Defined outside component to prevent re-render focus loss
const InputGroup = ({ label, name, value, onChange, type = "text", required = false, placeholder = "", readOnly = false }: any) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
    />
  </div>
);

const App = () => {
  const [data, setData] = useState<LabelData>(initialLabelData);
  const [labelSize, setLabelSize] = useState<LabelSize>('outer');
  const [isSaving, setIsSaving] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  
  // Initialize dynamic defaults
  useEffect(() => {
    // 1. Calculate Date Code (YYWW)
    const currentYYWW = getYYWW();

    // 2. Initial HU Generation
    const initialHU = generateTimeBasedHU(currentYYWW);

    setData(prev => ({
      ...prev,
      dateCode: currentYYWW,
      huNumber: initialHU,
      // Ensure fixed values are set if not already in initialLabelData
      vendorCode: "3000594",
      expiryDate: "31-12-50",
      supplierName: "ELCOMP TRADING SDN BHD",
      coo: "JP"
    }));
  }, []);

  /**
   * Generates HU Number based on Time.
   * Format: 1 + HHmmss (6 digits)
   * Example: 1103045 (10:30:45)
   * Full String: 1HHmmss + YYWW + V + VendorCode
   */
  const generateTimeBasedHU = (yyww: string) => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Constraint: First number 1 fixed, followed by 6 unique digits (HHmmss)
    const uniqueSixDigits = `${hours}${minutes}${seconds}`;
    const runningNum = `1${uniqueSixDigits}`;
    
    const vendorCode = "3000594"; 
    // Format: RunningNum + YYWW + V + VendorCode
    return `${runningNum}${yyww}V${vendorCode}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateHU = () => {
    const newHU = generateTimeBasedHU(data.dateCode);
    setData(prev => ({ ...prev, huNumber: newHU }));
  };

  const handleSavePDF = async () => {
    if (!labelRef.current) return;
    setIsSaving(true);
    
    try {
      // Small timeout to ensure any recent renders are finished
      await new Promise(resolve => setTimeout(resolve, 50));

      // Generate High-Res Canvas
      const canvas = await html2canvas(labelRef.current, {
        scale: 4, // Higher scale for better text clarity
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });

      // Create PDF with A4 size
      const pdf = new jsPDF({
          orientation: 'portrait', 
          unit: 'in',
          format: 'a4'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Dimensions in inches
      // Outer: 6" x 3.23"
      // Inner: 3.1" x 1.6"
      const width = labelSize === 'outer' ? 6 : 3.1;
      const height = labelSize === 'outer' ? 3.23 : 1.6;

      // Position at top-left with 0.5in margin
      pdf.addImage(imgData, 'JPEG', 0.5, 0.5, width, height);
      
      // Download with HU Number in filename
      const fileName = `SanDisk_Label_${data.huNumber || 'Preview'}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("Error generating label image:", error);
      alert("Failed to generate label PDF.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - Hidden on Print */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-800">SanDisk Label Printer</h1>
                <span className="text-xs text-gray-500">Substrate Mode</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={handleGenerateHU}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300"
              title="Generate new time-based HU Number"
            >
              <RefreshCw size={18} />
              Refresh HU
            </button>
            <button 
              onClick={handleSavePDF}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Download size={20} />
              {isSaving ? 'Saving...' : 'Save Live Preview as PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex max-w-7xl mx-auto w-full p-6 gap-6 print:p-0">
        
        {/* Left Sidebar: Settings & Form - Hidden on Print */}
        <div className="w-1/3 flex flex-col gap-6 print:hidden h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Configuration Card */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <Settings size={16} /> Configuration
            </h2>
            
            <div className="space-y-4">
               <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Label Size</label>
                  <div className="flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setLabelSize('outer')}
                      className={`px-4 py-2 text-sm font-medium border rounded-l-lg flex-1 ${
                        labelSize === 'outer' 
                          ? 'bg-gray-800 text-white border-gray-800 z-10' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Outer Box (6" x 3.23")
                    </button>
                    <button
                      type="button"
                      onClick={() => setLabelSize('inner')}
                      className={`px-4 py-2 text-sm font-medium border rounded-r-lg flex-1 -ml-px ${
                        labelSize === 'inner' 
                          ? 'bg-gray-800 text-white border-gray-800 z-10' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Inner Reel (3.1" x 1.6")
                    </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Data Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
             <h2 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <FileText size={16} /> Label Data (Substrate)
             </h2>
             
             <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                   <InputGroup label="Vendor Name" name="supplierName" value={data.supplierName} onChange={handleInputChange} readOnly={true} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="PO Number" name="poNumber" value={data.poNumber} onChange={handleInputChange} required />
                   <InputGroup label="PO Line" name="poLine" value={data.poLine} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <InputGroup 
                      label="Handling Unit (HU)" 
                      name="huNumber" 
                      value={data.huNumber} 
                      onChange={handleInputChange} 
                      placeholder="Auto-Generated" 
                      required 
                      readOnly={true} 
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="IBD Number" name="ibdNumber" value={data.ibdNumber} onChange={handleInputChange} placeholder="Optional" />
                   <InputGroup label="Batch No" name="batchNumber" value={data.batchNumber} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="SanDisk PN" name="sandiskPN" value={data.sandiskPN} onChange={handleInputChange} required />
                   <InputGroup label="Quantity" name="quantity" value={data.quantity} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="MPN" name="mpn" value={data.mpn} onChange={handleInputChange} required />
                   <InputGroup label="Date Code" name="dateCode" value={data.dateCode} onChange={handleInputChange} placeholder="YYWW" required readOnly={true} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="Vendor Lot" name="vendorLot" value={data.vendorLot} onChange={handleInputChange} placeholder="DateCode YYWW" />
                   <InputGroup label="Expiry Date" name="expiryDate" value={data.expiryDate} onChange={handleInputChange} placeholder="DD-MM-YY" readOnly={true} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="Country (COO)" name="coo" value={data.coo} onChange={handleInputChange} placeholder="e.g. JP, MY, CN" />
                   <InputGroup label="Box No" name="boxNo" value={data.boxNo} onChange={handleInputChange} />
                </div>

                {/* Moved Substrate Fields Here */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <InputGroup label="Revision (Rev)" name="rev" value={data.rev} onChange={handleInputChange} />
                    <InputGroup label="Number (Num)" name="num" value={data.num} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="MSL Level" name="msl" value={data.msl} onChange={handleInputChange} />
                    <InputGroup label="Plant Code" name="plantCode" value={data.plantCode} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Vendor Code" name="vendorCode" value={data.vendorCode} onChange={handleInputChange} readOnly={true} />
                    <InputGroup label="ASN" name="asn" value={data.asn} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <InputGroup label="Material Desc" name="materialDesc" value={data.materialDesc} onChange={handleInputChange} />
                    <InputGroup label="GR Date" name="grDate" value={data.grDate} onChange={handleInputChange} placeholder="Leave blank if needed" />
                </div>
             </div>
          </div>

        </div>

        {/* Right Preview Area */}
        <div className="w-2/3 bg-gray-200 rounded-xl flex items-center justify-center p-10 relative print:static">
           <div className="absolute top-4 right-4 text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full print:hidden">
             Live Preview: {labelSize === 'outer' ? '6" x 3.23"' : '3.1" x 1.6"'}
           </div>
           
           {/* The actual label component with Ref for Capture */}
           <div className="shadow-2xl print:shadow-none" id="print-area">
             {labelSize === 'outer' ? (
                <OuterLabel ref={labelRef} data={data} type="substrate" />
             ) : (
                <InnerLabel ref={labelRef} data={data} type="substrate" />
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;