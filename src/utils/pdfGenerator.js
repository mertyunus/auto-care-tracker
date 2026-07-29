import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const replaceTurkishChars = (text) => {
  if (!text) return '';
  return text
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c');
};

export const generateVehiclePDF = (vehicle, records, costData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text('Garaj Defterim Raporu', 14, 22);
  
  // Vehicle Details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(replaceTurkishChars(`Araç: ${vehicle.brand} ${vehicle.model} (${vehicle.year})`), 14, 32);
  doc.text(replaceTurkishChars(`Plaka: ${vehicle.plate}`), 14, 38);
  doc.text(`Guncel Kilometre: ${vehicle.currentMileage?.toLocaleString('tr-TR')} km`, 14, 44);
  
  // Cost Summary
  let totalCost = 0;
  records.forEach(r => totalCost += (r.totalCost || 0));
  
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Masraf Ozeti', 14, 56);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Toplam Harcama: ${totalCost.toLocaleString('tr-TR')} TL`, 14, 64);
  
  let yPos = 70;
  costData.forEach((cost, idx) => {
    doc.text(replaceTurkishChars(`- ${cost.name}: ${cost.value.toLocaleString('tr-TR')} TL`), 14, yPos);
    yPos += 6;
  });

  // Records Table
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  yPos += 8;
  doc.text('Islem Gecmisi', 14, yPos);

  const tableData = records.map(r => [
    r.date?.toDate().toLocaleDateString('tr-TR') || '',
    `${r.mileage?.toLocaleString('tr-TR')} km`,
    replaceTurkishChars(r.category),
    replaceTurkishChars(r.description || '-'),
    `${r.totalCost?.toLocaleString('tr-TR')} TL`
  ]);

  autoTable(doc, {
    startY: yPos + 6,
    head: [['Tarih', 'Kilometre', 'Kategori', 'Aciklama', 'Tutar']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 },
  });

  // Save the PDF
  doc.save(`${vehicle.plate}_Gecmis_Raporu.pdf`);
};
