package com.hpms.backend.service.pdf;

import com.hpms.backend.filter.VatFilter;
import com.hpms.backend.model.Vat;
import com.hpms.backend.service.inter.IVatService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.util.List;

@Service
public class VatPdfService {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private IVatService vatService;

    public byte[] generateVatPdf() throws DocumentException, IOException {
        List<Vat> vatList = vatService.getVats(new VatFilter());

        Paragraph title = pdfService.createTitle("VAT Rates Report");
        Paragraph subtitle = pdfService.createSubtitle("Complete list of all VAT rates");

        PdfPTable table = createVatTable(vatList);

        Chapter chapter = new Chapter(title, 1);
        chapter.add(subtitle);
        chapter.add(table);

        return pdfService.generatePdf("VAT Rates Report", chapter);
    }

    private PdfPTable createVatTable(List<Vat> vatList) {
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20);

        // Set column widths: ID smaller, others proportional
        float[] columnWidths = {10f, 60f, 30f}; // ID, VAT Name, Percentage
        try {
            table.setWidths(columnWidths);
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        PdfPCell headerCell1 = new PdfPCell(new Phrase("ID", headerFont));
        headerCell1.setBackgroundColor(new Color(216, 169, 2));
        headerCell1.setPadding(5);
        headerCell1.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell1);

        PdfPCell headerCell2 = new PdfPCell(new Phrase("VAT Name", headerFont));
        headerCell2.setBackgroundColor(new Color(216, 169, 2));
        headerCell2.setPadding(5);
        headerCell2.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell2);

        PdfPCell headerCell3 = new PdfPCell(new Phrase("Percentage (%)", headerFont));
        headerCell3.setBackgroundColor(new Color(216, 169, 2));
        headerCell3.setPadding(5);
        headerCell3.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell3);

        for (Vat vat : vatList) {
            PdfPCell idCell = new PdfPCell(new Phrase(String.valueOf(vat.getId()), cellFont));
            idCell.setPadding(8);
            idCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(idCell);

            PdfPCell nameCell = new PdfPCell(new Phrase(vat.getName(), cellFont));
            nameCell.setPadding(8);
            table.addCell(nameCell);

            PdfPCell percentageCell = new PdfPCell(new Phrase(String.valueOf(vat.getPercentage()), cellFont));
            percentageCell.setPadding(8);
            percentageCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(percentageCell);
        }

        return table;
    }
}