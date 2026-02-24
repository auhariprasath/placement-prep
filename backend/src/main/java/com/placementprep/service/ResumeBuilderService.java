package com.placementprep.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.placementprep.dto.ResumeRequest;
import org.springframework.stereotype.Service;

import java.awt.Color;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class ResumeBuilderService {
    
    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(0, 51, 102));
    private static final Font SECTION_FONT = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(0, 51, 102));
    private static final Font SUBSECTION_FONT = new Font(Font.HELVETICA, 11, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL);
    private static final Font SMALL_FONT = new Font(Font.HELVETICA, 9, Font.NORMAL);
    
    public byte[] generateResume(ResumeRequest request) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        
        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            
            addHeader(document, request);
            addSummary(document, request);
            addEducation(document, request);
            addExperience(document, request);
            addSkills(document, request);
            addProjects(document, request);
            addCertifications(document, request);
            
            document.close();
            return baos.toByteArray();
            
        } catch (DocumentException e) {
            throw new IOException("Error generating resume PDF", e);
        }
    }
    
    private void addHeader(Document document, ResumeRequest request) throws DocumentException {
        Paragraph name = new Paragraph(request.getFullName(), TITLE_FONT);
        name.setAlignment(Element.ALIGN_CENTER);
        document.add(name);
        
        Paragraph contact = new Paragraph();
        contact.setAlignment(Element.ALIGN_CENTER);
        contact.setFont(SMALL_FONT);
        
        StringBuilder contactInfo = new StringBuilder();
        contactInfo.append(request.getEmail());
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            contactInfo.append(" | ").append(request.getPhone());
        }
        if (request.getAddress() != null && !request.getAddress().isEmpty()) {
            contactInfo.append(" | ").append(request.getAddress());
        }
        contact.add(contactInfo.toString());
        
        if (request.getLinkedIn() != null && !request.getLinkedIn().isEmpty()) {
            contact.add("\nLinkedIn: " + request.getLinkedIn());
        }
        if (request.getPortfolio() != null && !request.getPortfolio().isEmpty()) {
            contact.add(" | Portfolio: " + request.getPortfolio());
        }
        
        document.add(contact);
        document.add(Chunk.NEWLINE);
        addSeparator(document);
    }
    
    private void addSummary(Document document, ResumeRequest request) throws DocumentException {
        if (request.getSummary() != null && !request.getSummary().isEmpty()) {
            Paragraph section = new Paragraph("PROFESSIONAL SUMMARY", SECTION_FONT);
            document.add(section);
            
            Paragraph summary = new Paragraph(request.getSummary(), NORMAL_FONT);
            summary.setAlignment(Element.ALIGN_JUSTIFIED);
            document.add(summary);
            document.add(Chunk.NEWLINE);
        }
    }
    
    private void addEducation(Document document, ResumeRequest request) throws DocumentException {
        if (request.getEducation() != null && !request.getEducation().isEmpty()) {
            Paragraph section = new Paragraph("EDUCATION", SECTION_FONT);
            document.add(section);
            
            for (ResumeRequest.Education edu : request.getEducation()) {
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                
                PdfPCell leftCell = new PdfPCell();
                leftCell.setBorder(Rectangle.NO_BORDER);
                Paragraph institution = new Paragraph(edu.getInstitution(), SUBSECTION_FONT);
                leftCell.addElement(institution);
                Paragraph degree = new Paragraph(edu.getDegree() + " in " + edu.getFieldOfStudy(), NORMAL_FONT);
                leftCell.addElement(degree);
                table.addCell(leftCell);
                
                PdfPCell rightCell = new PdfPCell();
                rightCell.setBorder(Rectangle.NO_BORDER);
                rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                String dateRange = edu.getStartDate() + " - " + edu.getEndDate();
                Paragraph dates = new Paragraph(dateRange, SMALL_FONT);
                dates.setAlignment(Element.ALIGN_RIGHT);
                rightCell.addElement(dates);
                if (edu.getGpa() != null && !edu.getGpa().isEmpty()) {
                    Paragraph gpa = new Paragraph("GPA: " + edu.getGpa(), SMALL_FONT);
                    gpa.setAlignment(Element.ALIGN_RIGHT);
                    rightCell.addElement(gpa);
                }
                table.addCell(rightCell);
                
                document.add(table);
            }
            document.add(Chunk.NEWLINE);
        }
    }
    
    private void addExperience(Document document, ResumeRequest request) throws DocumentException {
        if (request.getExperience() != null && !request.getExperience().isEmpty()) {
            Paragraph section = new Paragraph("WORK EXPERIENCE", SECTION_FONT);
            document.add(section);
            
            for (ResumeRequest.Experience exp : request.getExperience()) {
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                
                PdfPCell leftCell = new PdfPCell();
                leftCell.setBorder(Rectangle.NO_BORDER);
                Paragraph company = new Paragraph(exp.getCompany(), SUBSECTION_FONT);
                leftCell.addElement(company);
                Paragraph position = new Paragraph(exp.getPosition(), NORMAL_FONT);
                leftCell.addElement(position);
                table.addCell(leftCell);
                
                PdfPCell rightCell = new PdfPCell();
                rightCell.setBorder(Rectangle.NO_BORDER);
                String dateRange = exp.getStartDate() + " - " + exp.getEndDate();
                Paragraph dates = new Paragraph(dateRange, SMALL_FONT);
                dates.setAlignment(Element.ALIGN_RIGHT);
                rightCell.addElement(dates);
                table.addCell(rightCell);
                
                document.add(table);
                
                if (exp.getResponsibilities() != null && !exp.getResponsibilities().isEmpty()) {
                    com.lowagie.text.List respList = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
                    respList.setIndentationLeft(20);
                    for (String responsibility : exp.getResponsibilities()) {
                        respList.add(new ListItem(responsibility, NORMAL_FONT));
                    }
                    document.add(respList);
                }
                document.add(Chunk.NEWLINE);
            }
        }
    }
    
    private void addSkills(Document document, ResumeRequest request) throws DocumentException {
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            Paragraph section = new Paragraph("SKILLS", SECTION_FONT);
            document.add(section);
            
            Paragraph skills = new Paragraph(String.join(" | ", request.getSkills()), NORMAL_FONT);
            document.add(skills);
            document.add(Chunk.NEWLINE);
        }
    }
    
    private void addProjects(Document document, ResumeRequest request) throws DocumentException {
        if (request.getProjects() != null && !request.getProjects().isEmpty()) {
            Paragraph section = new Paragraph("PROJECTS", SECTION_FONT);
            document.add(section);
            
            for (ResumeRequest.Project project : request.getProjects()) {
                Paragraph name = new Paragraph(project.getName(), SUBSECTION_FONT);
                document.add(name);
                
                if (project.getTechnologies() != null && !project.getTechnologies().isEmpty()) {
                    Paragraph tech = new Paragraph("Technologies: " + project.getTechnologies(), SMALL_FONT);
                    document.add(tech);
                }
                
                Paragraph desc = new Paragraph(project.getDescription(), NORMAL_FONT);
                document.add(desc);
                
                if (project.getLink() != null && !project.getLink().isEmpty()) {
                    Paragraph link = new Paragraph("Link: " + project.getLink(), SMALL_FONT);
                    document.add(link);
                }
                document.add(Chunk.NEWLINE);
            }
        }
    }
    
    private void addCertifications(Document document, ResumeRequest request) throws DocumentException {
        if (request.getCertifications() != null && !request.getCertifications().isEmpty()) {
            Paragraph section = new Paragraph("CERTIFICATIONS", SECTION_FONT);
            document.add(section);
            
            com.lowagie.text.List certList = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
            certList.setIndentationLeft(20);
            for (String cert : request.getCertifications()) {
                certList.add(new ListItem(cert, NORMAL_FONT));
            }
            document.add(certList);
            document.add(Chunk.NEWLINE);
        }
    }
    
    private void addSeparator(Document document) throws DocumentException {
        Paragraph separator = new Paragraph(new Chunk(new LineSeparator()));
        document.add(separator);
        document.add(Chunk.NEWLINE);
    }
}
