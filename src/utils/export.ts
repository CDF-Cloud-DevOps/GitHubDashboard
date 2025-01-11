import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export function exportToExcel(data: any, filename: string) {
  // Flatten the nested data structure
  const flattenedData = Object.entries(data).reduce((acc: any[], [category, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subCategory, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            acc.push({
              category,
              subCategory,
              ...item
            });
          });
        }
      });
    }
    return acc;
  }, []);

  if (flattenedData.length === 0) {
    throw new Error('No data to export');
  }

  const ws = XLSX.utils.json_to_sheet(flattenedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'GitHub Analytics');
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(dataBlob, `${filename}.xlsx`);
}