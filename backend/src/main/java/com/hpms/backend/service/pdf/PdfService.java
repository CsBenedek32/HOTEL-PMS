package com.hpms.backend.service.pdf;

import com.hpms.backend.model.CompanyInfo;
import com.hpms.backend.service.inter.ICompanyInfoService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    @Autowired
    private ICompanyInfoService companyInfoService;

    public byte[] generatePdf(String title, Element content) throws DocumentException, IOException {
        Document document = new Document(PageSize.A4, 36, 36, 80, 50);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        CompanyInfo companyInfo = companyInfoService.getCompanyInfo();
        PdfWriter writer = PdfWriter.getInstance(document, outputStream);
        writer.setPageEvent(new HeaderFooterPageEvent(title, companyInfo));

        document.open();
        document.add(content);
        document.close();

        return outputStream.toByteArray();
    }

    public Paragraph createTitle(String title) {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
        Paragraph titleParagraph = new Paragraph(title, titleFont);
        titleParagraph.setAlignment(Element.ALIGN_CENTER);
        titleParagraph.setSpacingAfter(20);
        return titleParagraph;
    }

    public Paragraph createSubtitle(String subtitle) {
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.DARK_GRAY);
        Paragraph subtitleParagraph = new Paragraph(subtitle, subtitleFont);
        subtitleParagraph.setSpacingAfter(10);
        return subtitleParagraph;
    }

    public Paragraph createNormalText(String text) {
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
        return new Paragraph(text, normalFont);
    }

    private static class HeaderFooterPageEvent extends PdfPageEventHelper {
        private String documentTitle;
        private CompanyInfo companyInfo;

        public HeaderFooterPageEvent(String documentTitle, CompanyInfo companyInfo) {
            this.documentTitle = documentTitle;
            this.companyInfo = companyInfo;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            addHeader(writer, document);
            addFooter(writer, document);
        }

        private void addHeader(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(216, 169, 2));
            Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY);

            float pageWidth = document.getPageSize().getWidth();
            float margin = document.leftMargin();

            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase(companyInfo.getCompanyName(), headerFont),
                    margin, document.getPageSize().getHeight() - 30, 0);

            ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT,
                    new Phrase(documentTitle, headerFont),
                    pageWidth - margin, document.getPageSize().getHeight() - 30, 0);

            String companyInfoLine = companyInfo.getAddress() + " | " + companyInfo.getPhone() + " | " + companyInfo.getEmail();
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase(companyInfoLine, infoFont),
                    margin, document.getPageSize().getHeight() - 45, 0);

            cb.setLineWidth(1f);
            cb.setColorStroke(Color.LIGHT_GRAY);
            cb.moveTo(margin, document.getPageSize().getHeight() - 55);
            cb.lineTo(pageWidth - margin, document.getPageSize().getHeight() - 55);
            cb.stroke();
        }

        private void addFooter(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();

            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY);

            float pageWidth = document.getPageSize().getWidth();
            float margin = document.leftMargin();

            cb.setLineWidth(1f);
            cb.setColorStroke(Color.LIGHT_GRAY);
            cb.moveTo(margin, document.bottomMargin() + 25);
            cb.lineTo(pageWidth - margin, document.bottomMargin() + 25);
            cb.stroke();

            String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase("Generated on: " + dateTime, footerFont),
                    margin, document.bottomMargin() + 10, 0);

            ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT,
                    new Phrase("Page " + writer.getPageNumber(), footerFont),
                    pageWidth - margin, document.bottomMargin() + 10, 0);
        }
    }
}