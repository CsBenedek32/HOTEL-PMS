package com.hpms.backend.service.implament;

import com.hpms.backend.model.CompanyInfo;
import com.hpms.backend.repository.CompanyInfoRepository;
import com.hpms.backend.service.inter.ICompanyInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CompanyInfoService implements ICompanyInfoService {
    
    private final CompanyInfoRepository companyInfoRepository;

    public CompanyInfo getCompanyInfo() {
        return companyInfoRepository.findFirstByOrderByIdAsc()
                .orElse(null);
    }

    public CompanyInfo saveCompanyInfo(CompanyInfo companyInfo) {
        Optional<CompanyInfo> existing = companyInfoRepository.findFirstByOrderByIdAsc();
        existing.ifPresent(info -> companyInfo.setId(info.getId()));
        return companyInfoRepository.save(companyInfo);
    }
}