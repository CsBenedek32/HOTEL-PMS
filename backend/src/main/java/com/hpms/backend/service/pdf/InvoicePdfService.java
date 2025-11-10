package com.hpms.backend.service.pdf;

import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Invoice;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.service.inter.IInvoiceService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RequiredArgsConstructor
@Service
public class InvoicePdfService {

    private final PdfService pdfService;
    private final IInvoiceService invoiceService;

    public byte[] generateInvoicePdf(Long invoiceId) throws DocumentException, IOException {
        Invoice invoice = invoiceService.getInvoiceById(invoiceId);

        Paragraph title = pdfService.createTitle("INVOICE");
        Chapter chapter = new Chapter(title, 1);

        // Invoice details
        chapter.add(createInvoiceDetailsSection(invoice));
        chapter.add(Chunk.NEWLINE);

        // Recipient information
        chapter.add(createRecipientSection(invoice));
        chapter.add(Chunk.NEWLINE);

        // Bookings table
        chapter.add(createBookingsTable(invoice.getBookings()));
        chapter.add(Chunk.NEWLINE);

        // Services table
        chapter.add(createServicesTable(invoice));
        chapter.add(Chunk.NEWLINE);

        // Total and signature
        chapter.add(createTotalSection(invoice));
        chapter.add(Chunk.NEWLINE);
        chapter.add(createSignatureSection());

        return pdfService.generatePdf("Invoice #" + invoice.getId(), chapter);
    }

    private Element createInvoiceDetailsSection(Invoice invoice) {
        Paragraph section = new Paragraph();

        section.add(pdfService.createSubtitle("Invoice Details"));
        section.add(pdfService.createNormalText("Invoice: " + invoice.getName()));
        section.add(pdfService.createNormalText("Description: " + (invoice.getDescription() != null ? invoice.getDescription() : "N/A")));
        section.add(pdfService.createNormalText("Payment Status: " + invoice.getPaymentStatus().toString()));
        section.add(Chunk.NEWLINE);
        Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.BLACK);
        section.add(new Paragraph("Total Amount: $" + String.format("%.2f", invoice.getTotalSum()), totalFont));
        
        return section;
    }

    private Element createRecipientSection(Invoice invoice) {
        Paragraph section = new Paragraph();

        section.add(pdfService.createSubtitle("Bill To:"));
        section.add(pdfService.createNormalText(invoice.getRecipientName()));

        if (invoice.getRecipientCompanyName() != null && !invoice.getRecipientCompanyName().isEmpty()) {
            section.add(pdfService.createNormalText(invoice.getRecipientCompanyName()));
        }

        section.add(pdfService.createNormalText(invoice.getRecipientAddress()));
        section.add(pdfService.createNormalText(invoice.getRecipientCity() + ", " + invoice.getRecipientPostalCode() + ", " + invoice.getRecipientCountry()));

        if (invoice.getRecipientTaxNumber() != null && !invoice.getRecipientTaxNumber().isEmpty()) {
            section.add(pdfService.createNormalText("Tax ID: " + invoice.getRecipientTaxNumber()));
        }

        section.add(pdfService.createNormalText("Email: " + invoice.getRecipientEmail()));
        section.add(pdfService.createNormalText("Phone: " + invoice.getRecipientPhone()));

        return section;
    }

    private PdfPTable createBookingsTable(List<Booking> bookings) {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20);

        float[] columnWidths = {25f, 15f, 15f, 10f, 35f}; // Booking, Check-in, Check-out, Nights, Rooms
        try {
            table.setWidths(columnWidths);
        } catch (DocumentException e) {

        }

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        // Headers
        String[] headers = {"Booking", "Check-in", "Check-out", "Nights", "Rooms"};
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, headerFont));
            headerCell.setBackgroundColor(new Color(216, 169, 2));
            headerCell.setPadding(5);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(headerCell);
        }

        // Data rows
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (Booking booking : bookings) {
            // Booking name
            table.addCell(createDataCell(booking.getName(), cellFont));

            // Check-in date
            table.addCell(createDataCell(booking.getCheckInDate().format(formatter), cellFont, Element.ALIGN_CENTER));

            // Check-out date
            table.addCell(createDataCell(booking.getCheckOutDate().format(formatter), cellFont, Element.ALIGN_CENTER));

            // Nights
            long nights = booking.getCheckOutDate().toEpochDay() - booking.getCheckInDate().toEpochDay();
            table.addCell(createDataCell(String.valueOf(nights), cellFont, Element.ALIGN_CENTER));

            // Rooms (compact format)
            String roomsText = createCompactRoomDisplay(booking.getRooms());
            table.addCell(createDataCell(roomsText, cellFont));
        }

        return table;
    }

    private String createCompactRoomDisplay(java.util.Set<Room> rooms) {
        return rooms.stream()
                .map(room -> room.getRoomNumber() + " (" + room.getRoomType().getTypeName() + ")")
                .reduce((r1, r2) -> r1 + ", " + r2)
                .orElse("No rooms");
    }

    private PdfPTable createServicesTable(Invoice invoice) {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20);

        float[] columnWidths = {25f, 30f, 12f, 8f, 12f, 13f}; // Service, Description, Cost, VAT%, VAT Amount, Total
        try {
            table.setWidths(columnWidths);
        } catch (DocumentException e) {

        }

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        // Headers
        String[] headers = {"Service", "Description", "Cost", "VAT %", "VAT Amount", "Total"};
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, headerFont));
            headerCell.setBackgroundColor(new Color(216, 169, 2));
            headerCell.setPadding(5);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(headerCell);
        }

        // Add room charges as first service
        //addRoomChargesRow(table, invoice, cellFont);

        // Add other services
        for (ServiceModel service : invoice.getServiceModels()) {
            addServiceRow(table, service, cellFont);
        }

        return table;
    }

    private void addServiceRow(PdfPTable table, ServiceModel service, Font cellFont) {
        double cost = service.getCost();
        double vatPercentage = service.getVat().getPercentage();
        double vatAmount = cost * (vatPercentage / 100);
        double totalWithVat = cost + vatAmount;

        table.addCell(createDataCell(service.getName(), cellFont));
        table.addCell(createDataCell(service.getDescription() != null ? service.getDescription() : "", cellFont));
        table.addCell(createDataCell(String.format("$%.2f", cost), cellFont, Element.ALIGN_RIGHT));
        table.addCell(createDataCell(String.format("%.0f%%", vatPercentage), cellFont, Element.ALIGN_CENTER));
        table.addCell(createDataCell(String.format("$%.2f", vatAmount), cellFont, Element.ALIGN_RIGHT));
        table.addCell(createDataCell(String.format("$%.2f", totalWithVat), cellFont, Element.ALIGN_RIGHT));
    }

    private double calculateRoomCharges(Invoice invoice) {
        double total = 0.0;
        for (Booking booking : invoice.getBookings()) {
            long nights = booking.getCheckOutDate().toEpochDay() - booking.getCheckInDate().toEpochDay();
            for (Room room : booking.getRooms()) {
                total += room.getRoomType().getPrice() * nights;
            }
        }
        return total;
    }

    private Element createTotalSection(Invoice invoice) {
        Paragraph section = new Paragraph();
        section.setAlignment(Element.ALIGN_RIGHT);

        Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Color.BLACK);
        section.add(new Paragraph("GRAND TOTAL: $" + String.format("%.2f", invoice.getTotalSum()), totalFont));

        return section;
    }

    private Element createSignatureSection() {
        Paragraph section = new Paragraph();
        section.setSpacingBefore(40);

        section.add(pdfService.createSubtitle("Customer Acknowledgment"));
        section.add(Chunk.NEWLINE);
        section.add(pdfService.createNormalText("Customer Signature: ____________________    Date: __________"));
        section.add(Chunk.NEWLINE);
        section.add(Chunk.NEWLINE);
        section.add(pdfService.createNormalText("Print Name: _________________________"));
        section.add(Chunk.NEWLINE);
        section.add(Chunk.NEWLINE);
        section.add(pdfService.createNormalText("By signing, I acknowledge receipt of services and agree to payment terms."));

        return section;
    }

    private PdfPCell createDataCell(String text, Font font) {
        return createDataCell(text, font, Element.ALIGN_LEFT);
    }

    private PdfPCell createDataCell(String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        cell.setHorizontalAlignment(alignment);
        return cell;
    }
}