package com.bookinghealthcare.backend.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class ExcelImporter {

    public static List<List<String>> readExcel(String filePath) {
        List<List<String>> rows = new ArrayList<>();

        DataFormatter formatter = new DataFormatter();   // Chuẩn để đọc mọi kiểu cell

        try (InputStream is = ExcelImporter.class.getClassLoader().getResourceAsStream(filePath);
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                List<String> cols = new ArrayList<>();

                for (Cell cell : row) {
                    String value = formatter.formatCellValue(cell);
                    cols.add(value.trim());
                }
                rows.add(cols);
            }

        } catch (Exception e) {
            System.err.println("❌ Error reading Excel: " + filePath);
            e.printStackTrace();
        }

        return rows;
    }
}
