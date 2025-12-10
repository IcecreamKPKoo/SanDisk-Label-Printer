

export type LabelType = 'non-substrate' | 'substrate';
export type LabelSize = 'outer' | 'inner';

export interface LabelData {
  // Common Fields
  supplierName: string;
  poNumber: string;
  poLine: string;
  huNumber: string; // Handling Unit
  ibdNumber: string; // Inbound Delivery
  batchNumber: string;
  sandiskPN: string; // Part Number
  quantity: string;
  mpn: string; // Manufacturing Part Number
  vendorLot: string;
  expiryDate: string; // DD-MM-YY
  coo: string; // Country of Origin
  dateCode: string; // YYWW
  boxNo: string;
  printDate: string; // DD/MM/YYYY
  
  // QR Specific Fields (Page 6/12)
  msl: string; // Moisture Sensitive Level
  grDate: string; // Leave blank usually, but needed for QR structure
  vendorCode: string;
  plantCode: string; // Default C039
  materialDesc: string;
  asn: string;

  // Substrate Only Fields (Page 8/12)
  rev: string;
  num: string;
}

export const initialLabelData: LabelData = {
  supplierName: "ELCOMP TRADING SDN BHD", // Default per request
  poNumber: "",
  poLine: "",
  huNumber: "", // Generated dynamically
  ibdNumber: "",
  batchNumber: "", // Optional now
  sandiskPN: "",
  quantity: "",
  mpn: "",
  vendorLot: "N / A", // Default per request
  expiryDate: "31-12-50", // Fixed default per request
  coo: "JP", // Default per request
  dateCode: "", // Generated dynamically
  boxNo: "1",
  printDate: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
  msl: "", // Default per request
  grDate: "",
  vendorCode: "14881", // Default per request
  plantCode: "C039",
  materialDesc: "",
  asn: "",
  rev: "",
  num: "",
};