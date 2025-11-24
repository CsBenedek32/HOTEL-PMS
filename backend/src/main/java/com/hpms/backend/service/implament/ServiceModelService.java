package com.hpms.backend.service.implament;

import com.hpms.backend.dto.ServiceModelDto;
import com.hpms.backend.dto.VatDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.ServiceModelFilter;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.model.Vat;
import com.hpms.backend.repository.ServiceModelRepository;
import com.hpms.backend.repository.VatRepository;
import com.hpms.backend.request.CreateServiceModelRequest;
import com.hpms.backend.request.UpdateServiceModelRequest;
import com.hpms.backend.service.inter.IServiceModelService;
import com.hpms.backend.util.RoomPriceCalculationUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceModelService implements IServiceModelService {
    private final ServiceModelRepository serviceModelRepository;
    private final VatRepository vatRepository;
    private final ModelMapper modelMapper;

    /**
     * Lekérdezi a szolgáltatás modelleket opcionális szűrőkkel.
     * Csak a nem virtuális (manuálisan létrehozott) szolgáltatásokat adja vissza.
     * A virtuális szolgáltatások a számlákhoz automatikusan generált szobadíjak.
     * @param filters Szűrési feltételek (null esetén minden szolgáltatást visszaad)
     * @return A szűrt szolgáltatás modellek listája
     */
    @Transactional(readOnly = true)
    @Override
    public List<ServiceModel> getServiceModels(ServiceModelFilter filters) {
        if (filters == null) {
            // Csak nem virtuális szolgáltatások
            return serviceModelRepository.findAll().stream()
                    .filter(serviceModel -> !serviceModel.getVirtual())
                    .collect(Collectors.toList());
        }

        return serviceModelRepository.findAll().stream()
                .filter(serviceModel -> !serviceModel.getVirtual())
                .filter(buildServiceModelPredicate(filters))
                .collect(Collectors.toList());
    }

    /**
     * Új szolgáltatás modell létrehozása.
     * @param request A létrehozási kérés adatai
     * @return A létrehozott szolgáltatás modell
     * @throws ResourceNotFoundException ha az ÁFA kulcs nem található
     */
    @Override
    public ServiceModel createServiceModel(CreateServiceModelRequest request) {
        Optional<Vat> vatOpt = vatRepository.findById(request.getVatId());
        if (vatOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
        }

        ServiceModel serviceModel = new ServiceModel();
        serviceModel.setName(request.getName());
        serviceModel.setDescription(request.getDescription());
        serviceModel.setCost(request.getCost());
        serviceModel.setVirtual(false);
        serviceModel.setImmutable(false);
        serviceModel.setVat(vatOpt.get());

        return serviceModelRepository.save(serviceModel);
    }

    /**
     * Virtuális szolgáltatás modell létrehozása a szobadíjak számításához.
     * A virtuális szolgáltatások automatikusan generálódnak a foglalások szobái alapján,
     * és a számla szinkronizálásakor kerülnek a számlára.
     * @param rooms A szobák listája
     * @param checkInDate Bejelentkezés dátuma
     * @param checkOutDate Kijelentkezés dátuma
     * @return A létrehozott virtuális szolgáltatás modell a kiszámolt összeggel
     */
    @Override
    public ServiceModel createVirtualServiceModel(List<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate) {
        // Alap szolgáltatás modell lekérése vagy létrehozása
        ServiceModel baseServiceModel = getOrCreateRoomsCostServiceModel();

        // Szobadíjak kiszámítása a megadott időszakra
        double totalCost = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkInDate, checkOutDate);

        // Virtuális szolgáltatás modell létrehozása
        ServiceModel virtualServiceModel = new ServiceModel();
        virtualServiceModel.setName(baseServiceModel.getName());
        virtualServiceModel.setDescription(baseServiceModel.getDescription());
        virtualServiceModel.setCost(totalCost);
        virtualServiceModel.setVirtual(true);  // Ez jelzi, hogy automatikusan generált
        virtualServiceModel.setImmutable(false);
        virtualServiceModel.setVat(baseServiceModel.getVat());

        return serviceModelRepository.save(virtualServiceModel);
    }

    /**
     * Szolgáltatás modell módosítása.
     * Ha a szolgáltatás immutable (módosíthatatlan), csak az ÁFA kulcs változtatható.
     * @param request A módosítási kérés adatai
     * @param targetId A módosítandó szolgáltatás ID-ja
     * @return A módosított szolgáltatás modell
     * @throws ResourceNotFoundException ha a szolgáltatás vagy ÁFA kulcs nem található
     */
    @Override
    public ServiceModel updateServiceModel(UpdateServiceModelRequest request, long targetId) {
        Optional<ServiceModel> existingServiceModelOpt = serviceModelRepository.findById(targetId);
        if (existingServiceModelOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
        }

        ServiceModel existingServiceModel = existingServiceModelOpt.get();

        // Immutable szolgáltatásnál csak az ÁFA kulcs módosítható
        if (Boolean.TRUE.equals(existingServiceModel.getImmutable())) {
            if (request.getVatId() != null) {
                Optional<Vat> vatOpt = vatRepository.findById(request.getVatId());
                if (vatOpt.isEmpty()) {
                    throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
                }
                existingServiceModel.setVat(vatOpt.get());
            }
            return serviceModelRepository.save(existingServiceModel);
        }

        // Normál szolgáltatás módosítása
        existingServiceModel.setName(request.getName());
        existingServiceModel.setDescription(request.getDescription());
        existingServiceModel.setCost(request.getCost());

        if (request.getVatId() != null) {
            Optional<Vat> vatOpt = vatRepository.findById(request.getVatId());
            if (vatOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
            }
            existingServiceModel.setVat(vatOpt.get());
        }

        return serviceModelRepository.save(existingServiceModel);
    }

    /**
     * Virtuális szolgáltatás modell módosítása.
     * Csak virtuális szolgáltatások módosíthatók ezzel a metódussal.
     * @param targetId A módosítandó szolgáltatás ID-ja
     * @param cost Az új költség (opcionális)
     * @param vatId Az új ÁFA kulcs ID-ja (opcionális)
     * @return A módosított szolgáltatás modell
     * @throws ResourceNotFoundException ha a szolgáltatás nem található
     * @throws IllegalStateException ha a szolgáltatás nem virtuális
     */
    @Override
    public ServiceModel updateVirtualServiceModel(long targetId, Double cost, Long vatId) {
        Optional<ServiceModel> existingServiceModelOpt = serviceModelRepository.findById(targetId);
        if (existingServiceModelOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
        }

        ServiceModel existingServiceModel = existingServiceModelOpt.get();

        // Csak virtuális szolgáltatás módosítható ezzel a metódussal
        if (!existingServiceModel.getVirtual()) {
            throw new IllegalStateException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
        }

        if (cost != null) {
            existingServiceModel.setCost(cost);
        }

        if (vatId != null) {
            Optional<Vat> vatOpt = vatRepository.findById(vatId);
            if (vatOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
            }
            existingServiceModel.setVat(vatOpt.get());
        }

        return serviceModelRepository.save(existingServiceModel);
    }

    /**
     * Szolgáltatás modell törlése.
     * Nem törölhető, ha immutable vagy ha számlához van rendelve.
     * @param targetId A törlendő szolgáltatás ID-ja
     * @throws ResourceNotFoundException ha a szolgáltatás nem található
     * @throws IllegalStateException ha a szolgáltatás immutable vagy használatban van
     */
    @Override
    public void deleteServiceModel(long targetId) {
        serviceModelRepository.findById(targetId).ifPresentOrElse(
                serviceModel -> {
                    // Immutable szolgáltatás nem törölhető
                    if (Boolean.TRUE.equals(serviceModel.getImmutable())) {
                        throw new IllegalStateException(FrontEndCodes.SERVICE_MODEL_IMMUTABLE_DELETE.getCode());
                    }
                    // Számlához rendelt szolgáltatás nem törölhető
                    if (serviceModel.getInvoices().isEmpty()) {
                        serviceModelRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.SERVICE_MODEL_HAS_INVOICES.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceModelDto convertServiceModelToDto(ServiceModel serviceModel) {
        ServiceModelDto serviceModelDto = modelMapper.map(serviceModel, ServiceModelDto.class);
        serviceModelDto.setVat(modelMapper.map(serviceModel.getVat(), VatDto.class));
        return serviceModelDto;
    }

    @Override
    public Predicate<ServiceModel> buildServiceModelPredicate(ServiceModelFilter filters) {
        Predicate<ServiceModel> predicate = serviceModel -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(serviceModel -> serviceModel.getId().equals(filters.getId()));
        }

        if (filters.getName() != null && !filters.getName().isEmpty()) {
            predicate = predicate.and(serviceModel ->
                    serviceModel.getName().toLowerCase().contains(filters.getName().toLowerCase()));
        }

        if (filters.getVatIds() != null && !filters.getVatIds().isEmpty()) {
            predicate = predicate.and(serviceModel -> filters.getVatIds().contains(serviceModel.getVat().getId()));
        }

        if (filters.getMinCost() != null) {
            predicate = predicate.and(serviceModel -> serviceModel.getCost() >= filters.getMinCost());
        }

        if (filters.getMaxCost() != null) {
            predicate = predicate.and(serviceModel -> serviceModel.getCost() <= filters.getMaxCost());
        }

        return predicate;
    }

    /**
     * Lekéri vagy létrehozza az alap szobadíj szolgáltatás modellt.
     * Ez a szolgáltatás modell szolgál sablonként a virtuális szolgáltatások létrehozásához.
     * Az ID=1 pozícióban keresi, ha nem találja, létrehozza.
     * @return Az alap szobadíj szolgáltatás modell
     * @throws IllegalStateException ha nincs ÁFA kulcs az adatbázisban
     */
    @Override
    public ServiceModel getOrCreateRoomsCostServiceModel() {
        Optional<ServiceModel> existingServiceModel = serviceModelRepository.findById(1L);

        // Ha létezik az alap szolgáltatás modell
        if (existingServiceModel.isPresent() &&
                "Rooms aggregated cost".equals(existingServiceModel.get().getName())) {
            ServiceModel serviceModel = existingServiceModel.get();

            // Biztosítjuk, hogy immutable legyen
            if (serviceModel.getImmutable() == null || !serviceModel.getImmutable()) {
                serviceModel.setImmutable(true);
                serviceModel = serviceModelRepository.save(serviceModel);
            }

            return serviceModel;
        }

        // Ha nem létezik, létrehozzuk az alap szolgáltatás modellt
        ServiceModel roomsCostServiceModel = new ServiceModel();
        roomsCostServiceModel.setName("Rooms aggregated cost");
        roomsCostServiceModel.setDescription("Base service model for room costs in invoices");
        roomsCostServiceModel.setCost(0.0);
        roomsCostServiceModel.setVirtual(false);
        roomsCostServiceModel.setImmutable(true);  // Nem törölhető és nem módosítható

        // Alapértelmezett ÁFA kulcs hozzárendelése
        Vat defaultVat = vatRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No VAT records found in database"));
        roomsCostServiceModel.setVat(defaultVat);

        return serviceModelRepository.save(roomsCostServiceModel);
    }
}