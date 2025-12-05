import { LabelData, LabelType } from './types';

/**
 * Calculates the current week number (1-53)
 */
export const getWeekNumber = (d: Date): number => {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
};

/**
 * Returns string in YYWW format (e.g. 2518 for Year 2025, Week 18)
 */
export const getYYWW = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const week = getWeekNumber(now).toString().padStart(2, '0');
  return `${year}${week}`;
};

/**
 * Generates the pipe-separated string for the QR code based on PDF Page 12 (Substrate).
 * 
 * Strict Order per PDF Page 12:
 * 1. Sandisk PN
 * 2. HU: Handling Unit
 * 3. Batch#: Sandisk Batch Number
 * 4. MPN: Manufacturing Part Number
 * 5. Date Code: YYWW
 * 6. Expiry Date: DD-MM-YY
 * 7. COO: Country of Origin
 * 8. MSL#: Moisture Sensitive Level
 * 9. IBD No: Inbound Delivery
 * 10. GR Date:
 * 11. Vendor Code
 * 12. Plant Code (Default C039)
 * 13. Material Description
 * 14. Purchase Order #
 * 15. Purchase Order Line Item #
 * 16. Box Qty (Quantity)
 * 17. Vendor Lot #
 * 18. ASN #
 * 19. Rev
 * 20. Num
 * 
 * Rules:
 * - Use | as separator.
 * - Empty fields result in consecutive pipes (e.g. ||).
 * - No spaces between columns.
 * - Trim data.
 */
export const generateQRString = (data: LabelData, type: LabelType): string => {
  const fields = [
    data.sandiskPN,       // 1. Sandisk PN
    data.huNumber,        // 2. Handling Unit
    data.batchNumber,     // 3. Batch#
    data.mpn,             // 4. MPN
    data.dateCode,        // 5. Date Code
    data.expiryDate,      // 6. Expiry Date
    data.coo,             // 7. COO
    data.msl,             // 8. MSL#
    data.ibdNumber,       // 9. IBD No
    data.grDate,          // 10. GR Date
    data.vendorCode,      // 11. Vendor Code
    data.plantCode,       // 12. Plant Code
    data.materialDesc,    // 13. Material Description
    data.poNumber,        // 14. Purchase Order#
    data.poLine,          // 15. PO Line Item#
    data.quantity,        // 16. Box Qty
    data.vendorLot,       // 17. Vendor Lot#
    data.asn              // 18. ASN#
  ];

  // Map to trimmed strings. If undefined/null, use empty string.
  let qrString = fields.map(f => (f || '').trim()).join('|');

  // Always Append Substrate specific fields (Page 12)
  const rev = (data.rev || '').trim();
  const num = (data.num || '').trim();
  qrString += `|${rev}|${num}`;

  return qrString;
};

// Helper to format date for display if needed
export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return dateString;
};