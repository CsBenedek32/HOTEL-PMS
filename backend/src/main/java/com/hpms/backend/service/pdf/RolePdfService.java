package com.hpms.backend.service.pdf;

import com.hpms.backend.filter.RoleFilter;
import com.hpms.backend.model.Role;
import com.hpms.backend.service.inter.IRoleService;
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
public class RolePdfService {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private IRoleService roleService;

    public byte[] generateRolePdf() throws DocumentException, IOException {
        List<Role> roleList = roleService.getRoles(new RoleFilter());

        Paragraph title = pdfService.createTitle("User Roles Report");
        Paragraph subtitle = pdfService.createSubtitle("Complete list of all user roles");

        PdfPTable table = createRoleTable(roleList);

        Chapter chapter = new Chapter(title, 1);
        chapter.add(subtitle);
        chapter.add(table);

        return pdfService.generatePdf("User Roles Report", chapter);
    }

    private PdfPTable createRoleTable(List<Role> roleList) {
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20);

        // Set column widths: ID smaller, others proportional
        float[] columnWidths = {10f, 60f, 30f}; // ID, Role Name, Status
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

        PdfPCell headerCell2 = new PdfPCell(new Phrase("Role Name", headerFont));
        headerCell2.setBackgroundColor(new Color(216, 169, 2));
        headerCell2.setPadding(5);
        headerCell2.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell2);

        PdfPCell headerCell3 = new PdfPCell(new Phrase("Status", headerFont));
        headerCell3.setBackgroundColor(new Color(216, 169, 2));
        headerCell3.setPadding(5);
        headerCell3.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell3);

        for (Role role : roleList) {
            PdfPCell idCell = new PdfPCell(new Phrase(String.valueOf(role.getId()), cellFont));
            idCell.setPadding(8);
            idCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(idCell);

            PdfPCell nameCell = new PdfPCell(new Phrase(role.getName(), cellFont));
            nameCell.setPadding(8);
            table.addCell(nameCell);

            String status = role.getActive() != null && role.getActive() ? "Active" : "Inactive";
            PdfPCell statusCell = new PdfPCell(new Phrase(status, cellFont));
            statusCell.setPadding(8);
            statusCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(statusCell);
        }

        return table;
    }
}