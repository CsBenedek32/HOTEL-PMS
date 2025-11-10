package com.hpms.backend.service.inter;

import com.hpms.backend.model.CompanyInfo;

public interface ICompanyInfoService {

    CompanyInfo getCompanyInfo();

    CompanyInfo saveCompanyInfo(CompanyInfo companyInfo);
}