package com.hpms.backend.service.pdf;

import com.hpms.backend.filter.UserFilter;
import com.hpms.backend.model.Role;
import com.hpms.backend.model.User;
import com.hpms.backend.service.inter.IUserService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserPdfService {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private IUserService userService;

    public byte[] generateUserPdf() throws DocumentException, IOException {
        List<User> userList = userService.getUsers(new UserFilter());

        Paragraph title = pdfService.createTitle("Users Report");
        Paragraph subtitle = pdfService.createSubtitle("Complete list of all users");

        PdfPTable table = createUserTable(userList);

        Chapter chapter = new Chapter(title, 1);
        chapter.add(subtitle);
        chapter.add(table);

        return pdfService.generatePdf("Users Report", chapter);
    }

    private PdfPTable createUserTable(List<User> userList) {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20);

        // Set column widths: ID smaller, others proportional
        float[] columnWidths = {8f, 18f, 18f, 25f, 15f, 16f}; // ID, First, Last, Email, Phone, Roles
        try {
            table.setWidths(columnWidths);
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        // Headers
        String[] headers = {"ID", "First Name", "Last Name", "Email", "Phone", "Roles"};
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, headerFont));
            headerCell.setBackgroundColor(new Color(216, 169, 2));
            headerCell.setPadding(5);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(headerCell);
        }

        // Data rows
        for (User user : userList) {
            // ID
            PdfPCell idCell = new PdfPCell(new Phrase(String.valueOf(user.getId()), cellFont));
            idCell.setPadding(8);
            idCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(idCell);

            // First Name
            PdfPCell firstNameCell = new PdfPCell(new Phrase(user.getFirstName() != null ? user.getFirstName() : "", cellFont));
            firstNameCell.setPadding(8);
            table.addCell(firstNameCell);

            // Last Name
            PdfPCell lastNameCell = new PdfPCell(new Phrase(user.getLastName() != null ? user.getLastName() : "", cellFont));
            lastNameCell.setPadding(8);
            table.addCell(lastNameCell);

            // Email
            PdfPCell emailCell = new PdfPCell(new Phrase(user.getEmail(), cellFont));
            emailCell.setPadding(8);
            table.addCell(emailCell);

            // Phone
            PdfPCell phoneCell = new PdfPCell(new Phrase(user.getPhone() != null ? user.getPhone() : "", cellFont));
            phoneCell.setPadding(8);
            table.addCell(phoneCell);

            // Roles (comma-separated)
            String roleNames = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.joining(", "));
            PdfPCell rolesCell = new PdfPCell(new Phrase(roleNames, cellFont));
            rolesCell.setPadding(8);
            table.addCell(rolesCell);
        }

        return table;
    }
}