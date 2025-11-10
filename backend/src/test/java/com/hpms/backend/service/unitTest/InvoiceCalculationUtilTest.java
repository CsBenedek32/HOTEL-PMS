package com.hpms.backend.service.unitTest;

import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.model.Vat;
import com.hpms.backend.util.InvoiceCalculationUtil;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class InvoiceCalculationUtilTest {

    @Test
    public void testCalculateTotalSum_NullList_ShouldReturnZero() {
        double result = InvoiceCalculationUtil.calculateTotalSum(null);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateTotalSum_EmptyList_ShouldReturnZero() {
        List<ServiceModel> serviceModels = new ArrayList<>();

        double result = InvoiceCalculationUtil.calculateTotalSum(serviceModels);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateTotalSum_SingleServiceWithoutVat_ShouldReturnCost() {
        ServiceModel serviceModel = new ServiceModel();
        serviceModel.setCost(100.0);
        serviceModel.setVat(null);

        List<ServiceModel> serviceModels = List.of(serviceModel);

        double result = InvoiceCalculationUtil.calculateTotalSum(serviceModels);

        assertEquals(100.0, result, 0.001);
    }

    @Test
    public void testCalculateTotalSum_SingleServiceWithVat_ShouldReturnCostPlusVat() {
        Vat vat = new Vat();
        vat.setPercentage(27.0);

        ServiceModel serviceModel = new ServiceModel();
        serviceModel.setCost(100.0);
        serviceModel.setVat(vat);

        List<ServiceModel> serviceModels = List.of(serviceModel);

        double result = InvoiceCalculationUtil.calculateTotalSum(serviceModels);

        assertEquals(127.0, result, 0.001);
    }

    @Test
    public void testCalculateTotalSum_MultipleServicesWithDifferentVat_ShouldReturnCorrectSum() {
        Vat vat27 = new Vat();
        vat27.setPercentage(27.0);

        Vat vat5 = new Vat();
        vat5.setPercentage(5.0);

        ServiceModel service1 = new ServiceModel();
        service1.setCost(100.0);
        service1.setVat(vat27);

        ServiceModel service2 = new ServiceModel();
        service2.setCost(200.0);
        service2.setVat(vat5);

        ServiceModel service3 = new ServiceModel();
        service3.setCost(50.0);
        service3.setVat(null);

        List<ServiceModel> serviceModels = List.of(service1, service2, service3);

        double result = InvoiceCalculationUtil.calculateTotalSum(serviceModels);

        double expected = 100.0 * 1.27 + 200.0 * 1.05 + 50.0;
        assertEquals(expected, result, 0.001);
    }

    @Test
    public void testCalculateTotalSum_ServiceWithNullCost_ShouldTreatAsZero() {
        Vat vat = new Vat();
        vat.setPercentage(27.0);

        ServiceModel serviceModel = new ServiceModel();
        serviceModel.setCost(null);
        serviceModel.setVat(vat);

        List<ServiceModel> serviceModels = List.of(serviceModel);

        double result = InvoiceCalculationUtil.calculateTotalSum(serviceModels);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateTotalSum_VatWithNullPercentage_ShouldTreatAsZero() {
        Vat vat = new Vat();
        vat.setPercentage(null);

        ServiceModel serviceModel = new ServiceModel();
        serviceModel.setCost(100.0);
        serviceModel.setVat(vat);

        List<ServiceModel> serviceModels = List.of(serviceModel);

        double result = InvoiceCalculationUtil.calculateTotalSum(serviceModels);

        assertEquals(100.0, result, 0.001);
    }
}
