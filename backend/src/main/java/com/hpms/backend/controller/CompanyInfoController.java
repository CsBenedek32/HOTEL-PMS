package com.hpms.backend.controller;

import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.model.CompanyInfo;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.ICompanyInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company-info")
public class CompanyInfoController {

    @Autowired
    private ICompanyInfoService companyInfoService;

    @GetMapping
    public ResponseEntity<ApiResponse> getCompanyInfo() {
        try {
            CompanyInfo companyInfo = companyInfoService.getCompanyInfo();
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), companyInfo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> saveCompanyInfo(@RequestBody CompanyInfo companyInfo) {
        try {
            CompanyInfo savedCompanyInfo = companyInfoService.saveCompanyInfo(companyInfo);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), savedCompanyInfo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }
}