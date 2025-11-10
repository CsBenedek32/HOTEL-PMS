package com.hpms.backend.util;

import com.hpms.backend.model.ServiceModel;

import java.util.List;

public class InvoiceCalculationUtil {

    public static double calculateTotalSum(List<ServiceModel> serviceModels) {
        if (serviceModels == null) {
            return 0.0;
        }

        return serviceModels.stream()
                .mapToDouble(serviceModel -> {
                    double cost = serviceModel.getCost() != null ? serviceModel.getCost() : 0.0;
                    double vatPercentage = serviceModel.getVat() != null && serviceModel.getVat().getPercentage() != null
                            ? serviceModel.getVat().getPercentage()
                            : 0.0;
                    return cost * (1 + vatPercentage / 100);
                })
                .sum();
    }
}
