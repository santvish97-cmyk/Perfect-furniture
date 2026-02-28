// Dynamic import to avoid build issues
export const generatePDF = async (data) => {
  try {
    // Dynamically import jsPDF
    const jsPDF = (await import('jspdf')).default;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Interior-themed color palette
    const softBeige = [245, 240, 230];
    const softGreen = [168, 196, 168];
    const elegantBrown = [139, 115, 85];
    const darkText = [60, 60, 60];
    const lightGray = [200, 200, 200];

    // Background - Soft gradient effect
    for (let i = 0; i < pageHeight; i += 5) {
      const alpha = i / pageHeight;
      const r = softBeige[0] + (255 - softBeige[0]) * alpha * 0.3;
      const g = softBeige[1] + (255 - softBeige[1]) * alpha * 0.3;
      const b = softBeige[2] + (255 - softBeige[2]) * alpha * 0.3;
      doc.setFillColor(r, g, b);
      doc.rect(0, i, pageWidth, 5, 'F');
    }

    let yPosition = 25;

    // Header Section - Company Name
    doc.setFontSize(28);
    doc.setTextColor(elegantBrown[0], elegantBrown[1], elegantBrown[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PERFECT FURNITURE', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;

    // Slogan
    doc.setFontSize(11);
    doc.setTextColor(softGreen[0] - 40, softGreen[1] - 40, softGreen[2] - 40);
    doc.setFont('helvetica', 'italic');
    doc.text('Professional Interior Solutions for Modern Homes', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Title - ESTIMATE QUOTATION
    doc.setFontSize(20);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTIMATE QUOTATION', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 3;
    doc.setDrawColor(elegantBrown[0], elegantBrown[1], elegantBrown[2]);
    doc.setLineWidth(0.8);
    doc.line(60, yPosition, pageWidth - 60, yPosition);

    yPosition += 12;

    // Client Information Section
    doc.setFontSize(11);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont('helvetica', 'bold');
    
    // Client Name
    doc.text('Client Name:', 25, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.clientName || '___________', 55, yPosition);
    
    // Date (right aligned)
    const today = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric' 
    });
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', pageWidth - 65, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(today, pageWidth - 45, yPosition);

    yPosition += 12;

    // Work Details Table Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(elegantBrown[0], elegantBrown[1], elegantBrown[2]);
    doc.text('WORK DETAILS', 25, yPosition);

    yPosition += 8;

    // Table border
    const tableStartY = yPosition;
    const tableWidth = pageWidth - 50;
    const tableX = 25;

    // Draw table background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.rect(tableX, tableStartY, tableWidth, 0, 'S'); // Will add height dynamically

    yPosition += 5;

    // Collect all selected items organized by category
    const categories = [];

    // Bedroom items
    data.bedrooms.forEach((bedroom, index) => {
      const bedroomItems = [];
      if (bedroom.items.bed) bedroomItems.push('Bed');
      if (bedroom.items.sideTable) bedroomItems.push('Side Table');
      if (bedroom.items.wardrobe) bedroomItems.push('Wardrobe');
      if (bedroom.items.dressingTable) bedroomItems.push('Dressing Table');

      if (bedroomItems.length > 0) {
        categories.push({
          name: index === 0 ? 'Bedroom' : `Bedroom ${index + 1}`,
          items: bedroomItems
        });
      }
    });

    // Living Room
    const livingItems = [];
    if (data.livingRoom.items.tvUnit) livingItems.push('TV Unit');
    if (data.livingRoom.items.sofaSet) livingItems.push('Sofa Set');
    if (data.livingRoom.items.falseCeiling) livingItems.push('False Ceiling');

    if (livingItems.length > 0) {
      categories.push({
        name: 'Living Room',
        items: livingItems
      });
    }

    // Kitchen
    if (data.kitchen.area) {
      categories.push({
        name: 'Kitchen',
        items: ['Modular Kitchen']
      });
    }

    // Additional Work
    const additionalWork = [];
    if (data.painting.area) additionalWork.push('Painting');
    if (data.electrical.units) additionalWork.push('Electrical Work');
    if (data.plumbing.units) additionalWork.push('Plumbing Work');
    if (data.livingRoom.items.safetyDoor) additionalWork.push('Safety Door');
    if (data.livingRoom.items.diningTable) additionalWork.push('Lights & Accessories');

    if (additionalWork.length > 0) {
      categories.push({
        name: 'Additional Work',
        items: additionalWork
      });
    }

    // Display categories in table
    doc.setFontSize(10);
    categories.forEach((category, catIndex) => {
      // Category name
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(elegantBrown[0], elegantBrown[1], elegantBrown[2]);
      doc.text(category.name, tableX + 5, yPosition);
      yPosition += 5;

      // Category items
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      category.items.forEach(item => {
        doc.text(`  • ${item}`, tableX + 8, yPosition);
        yPosition += 4;
      });

      yPosition += 2;

      // Divider line between categories (except last)
      if (catIndex < categories.length - 1) {
        doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.setLineWidth(0.2);
        doc.line(tableX + 5, yPosition, tableX + tableWidth - 5, yPosition);
        yPosition += 3;
      }
    });

    yPosition += 3;

    // Close table border
    const tableHeight = yPosition - tableStartY;
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.rect(tableX, tableStartY, tableWidth, tableHeight, 'S');

    yPosition += 12;

    // Total Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(elegantBrown[0], elegantBrown[1], elegantBrown[2]);
    doc.text('TOTAL PROJECT COST', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;

    // Total amount in box
    doc.setDrawColor(elegantBrown[0], elegantBrown[1], elegantBrown[2]);
    doc.setLineWidth(0.8);
    doc.rect(55, yPosition - 8, pageWidth - 110, 18, 'S');

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    
    // Clean amount display - using Rs. instead of unicode to avoid rendering issues
    const formattedAmount = data.totalCost.toLocaleString('en-IN');
    const totalAmountText = 'Rs. ' + formattedAmount;
    doc.text(totalAmountText, pageWidth / 2, yPosition + 3, { align: 'center' });

    yPosition += 20;

    // Terms & Conditions
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(elegantBrown[0], elegantBrown[1], elegantBrown[2]);
    doc.text('Terms & Conditions', 25, yPosition);

    yPosition += 6;

    // Terms text
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    
    const terms = [
      '• 50% advance payment required to start work',
      '• Balance payment after completion',
      '• Quotation valid for 30 days',
      '• Material selection may affect final price'
    ];

    terms.forEach(term => {
      doc.text(term, 25, yPosition);
      yPosition += 5;
    });

    // Footer - Inspirational Quote
    const footerY = pageHeight - 20;
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(40, footerY - 5, pageWidth - 40, footerY - 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(softGreen[0] - 40, softGreen[1] - 40, softGreen[2] - 40);
    doc.text('"Angels fly because they take themselves lightly."', pageWidth / 2, footerY, { align: 'center' });

    // Save PDF
    const fileName = `Estimate_Quotation_${data.clientName?.replace(/\s+/g, '_') || 'Client'}_${Date.now()}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    alert(`PDF generation failed: ${error.message}\n\nPlease refresh the page and try again.`);
  }
};
