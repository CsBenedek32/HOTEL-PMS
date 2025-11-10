package com.hpms.backend.service.pdf;

import com.hpms.backend.filter.AmenityFilter;
import com.hpms.backend.model.Amenity;
import com.hpms.backend.service.inter.IAmenityService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AmenitiesPdfService {
    private final PdfService pdfService;
    private final IAmenityService amenityService;

    public byte[] generateAmenitiesPdf() throws DocumentException, IOException {
        List<Amenity> amenities = amenityService.getAmenities(new AmenityFilter());

        Document document = new Document();

        Paragraph title = pdfService.createTitle("Amenities Report");
        Paragraph subtitle = pdfService.createSubtitle("Complete list of all amenities");

        PdfPTable table = createAmenitiesTable(amenities);

        Chapter chapter = new Chapter(title, 1);
        chapter.add(subtitle);
        chapter.add(table);

        return pdfService.generatePdf("Amenities Report", chapter);
    }

    private PdfPTable createAmenitiesTable(List<Amenity> amenities) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20);

        // Set column widths: ID smaller, name larger
        float[] columnWidths = {15f, 85f}; // ID, Amenity Name
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

        PdfPCell headerCell2 = new PdfPCell(new Phrase("Amenity Name", headerFont));
        headerCell2.setBackgroundColor(new Color(216, 169, 2));
        headerCell2.setPadding(5);
        headerCell2.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell2);

        for (Amenity amenity : amenities) {
            PdfPCell idCell = new PdfPCell(new Phrase(String.valueOf(amenity.getId()), cellFont));
            idCell.setPadding(8);
            idCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(idCell);

            PdfPCell nameCell = new PdfPCell(new Phrase(amenity.getAmenityName(), cellFont));
            nameCell.setPadding(8);
            table.addCell(nameCell);
        }

        return table;
    }
}