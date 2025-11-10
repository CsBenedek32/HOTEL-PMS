package com.hpms.backend.data;

import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.enumCollection.GuestTypeEnum;
import com.hpms.backend.enumCollection.PaymentStatusEnum;
import com.hpms.backend.enumCollection.RoomStatusEnum;
import com.hpms.backend.model.*;
import com.hpms.backend.repository.BookingRepository;
import com.hpms.backend.repository.DataInitFlagRepository;
import com.hpms.backend.repository.DevLogRepository;
import com.hpms.backend.request.*;
import com.hpms.backend.service.implament.BookingService;
import com.hpms.backend.service.inter.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final String INITIAL_DATA_FLAG = "INITIAL_DATA_LOADED";
    private final IVatService vatService;
    private final IRoleService roleService;
    private final IAmenityService amenityService;
    private final IBedTypeService bedTypeService;
    private final IBuildingService buildingService;
    private final IGuestTagService guestTagService;
    private final ICompanyInfoService companyInfoService;
    private final IGuestService guestService;
    private final IServiceModelService serviceModelService;
    private final IUserService userService;
    private final IRoomTypeService roomTypeService;
    private final DevLogRepository devLogRepository;
    private final IRoomService roomService;
    private final DataInitFlagRepository dataInitFlagRepository;
    private final BookingService bookingService;
    private final IInvoiceService invoiceService;
    private final BookingRepository bookingRepository;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking if initial data needs to be loaded...");

        if (!isDataAlreadyInitialized()) {
            log.info("Loading initial data...");

            initializeVat();
            initializeRoles();
            initializeAmenities();
            initializeBedTypes();
            initializeBuildings();
            initializeGuestTags();
            initializeCompanyInfo();
            initializeGuests();

            // Level 2 - depends on Level 1
            initializeServiceModels();
            initializeUsers();
            initializeRoomTypes();
            initializeDevLogs();

            // Level 3 - depends on Level 2
            initializeRooms();


            markDataAsInitialized();
            log.info("Initial data loading completed successfully.");
        } else {
            log.info("Initial data already exists, skipping initialization.");
        }
    }

    private boolean isDataAlreadyInitialized() {
        return dataInitFlagRepository.existsByFlagKeyAndCompleted(INITIAL_DATA_FLAG, true);
    }

    private void markDataAsInitialized() {
        DataInitFlag flag = new DataInitFlag();
        flag.setFlagKey(INITIAL_DATA_FLAG);
        flag.setCompleted(true);
        dataInitFlagRepository.save(flag);
        log.info("Marked initial data as initialized.");
    }

    private void initializeVat() {
        if (vatService.getVats(null).isEmpty()) {
            vatService.createVat(createVatRequest("Standard VAT", 10.0));
            vatService.createVat(createVatRequest("Reduced VAT", 5.0));
            vatService.createVat(createVatRequest("Luxury VAT", 23.0));
        }
    }

    private void initializeRoles() {
        if (roleService.getRoles(null).isEmpty()) {
            roleService.createRole(createRoleRequest("Admin"));
            roleService.createRole(createRoleRequest("Receptionist"));
            roleService.createRole(createRoleRequest("Housekeeping"));
            roleService.createRole(createRoleRequest("Invoice Manager"));
            roleService.createRole(createRoleRequest("Data maintainer"));
            roleService.createRole(createRoleRequest("Default User"));
        }
    }

    private void initializeAmenities() {
        if (amenityService.getAmenities(null).isEmpty()) {
            amenityService.createAmenity(createAmenityRequest("WiFi"));
            amenityService.createAmenity(createAmenityRequest("Air Conditioning"));
            amenityService.createAmenity(createAmenityRequest("Parking"));
            amenityService.createAmenity(createAmenityRequest("Plasma Tv"));
            amenityService.createAmenity(createAmenityRequest("Jacuzzi"));
        }
    }

    private void initializeBedTypes() {
        if (bedTypeService.getBedTypes(null).isEmpty()) {
            bedTypeService.createBedType(createBedTypeRequest("Single"));
            bedTypeService.createBedType(createBedTypeRequest("Double"));
            bedTypeService.createBedType(createBedTypeRequest("King"));
            bedTypeService.createBedType(createBedTypeRequest("Baby Cot"));
        }
    }

    private void initializeBuildings() {
        if (buildingService.getBuildings(null).isEmpty()) {
            buildingService.createBuilding(createBuildingRequest("Main Building", "Primary hotel building", "123 Hotel Street", "Hotel City", "12345", "Hotel Country", "+1-555-0001", "main@hotel.com"));
            buildingService.createBuilding(createBuildingRequest("Annex Building", "Secondary hotel building", "124 Hotel Street", "Hotel City", "12345", "Hotel Country", "+1-555-0002", "annex@hotel.com"));
            buildingService.createBuilding(createBuildingRequest("Suite Building", "Luxury suite building", "125 Hotel Street", "Hotel City", "12345", "Hotel Country", "+1-555-0003", "suites@hotel.com"));
        }
    }

    private void initializeGuestTags() {
        if (guestTagService.getGuestTags(null).isEmpty()) {
            guestTagService.createGuestTag(createGuestTagRequest("VIP"));
            guestTagService.createGuestTag(createGuestTagRequest("Frequent Guest"));
            guestTagService.createGuestTag(createGuestTagRequest("Corporate"));
            guestTagService.createGuestTag(createGuestTagRequest("Family"));
        }
    }

    private void initializeCompanyInfo() {
        CompanyInfo existingInfo = companyInfoService.getCompanyInfo();
        if (existingInfo == null) {
            CompanyInfo companyInfo = new CompanyInfo();
            companyInfo.setCompanyName("Generic Hotel Management");
            companyInfo.setAddress("456 Business Avenue, Suite 100, Business City, BC 12345");
            companyInfo.setPhone("+1-555-1323-1");
            companyInfo.setEmail("info@generic.com");
            companyInfo.setWebsite(null);
            companyInfo.setLogoUrl(null);
            companyInfo.setTaxNumber("TAX-123456789");
            companyInfo.setRegistrationNumber("REG-987654321");

            companyInfoService.saveCompanyInfo(companyInfo);
        } else {
            System.out.println("Company info already exists: " + existingInfo.getCompanyName());
        }
    }

    private void initializeGuests() {
        if (guestService.getGuests(null).isEmpty()) {
            guestService.createGuest(createGuestRequest("John", "Doe", "john.doe@email.com", "+1-555-1001", GuestTypeEnum.ADULT, "Hungary"));
            guestService.createGuest(createGuestRequest("Jane", "Smith", "jane.smith@email.com", "+1-555-1002", GuestTypeEnum.ADULT, "Hungary"));
            guestService.createGuest(createGuestRequest("Alice", "Johnson", "alice.johnson@email.com", "+1-555-1003", GuestTypeEnum.ADULT, "Hungary"));
            guestService.createGuest(createGuestRequest("János", "Doe", "janos.doe@email.com", "+1-555-1004", GuestTypeEnum.ADULT, "Hungary"));
            guestService.createGuest(createGuestRequest("Bálint", "Smith", "balint.smith@email.com", "+1-555-1005", GuestTypeEnum.CHILD, "Hungary"));
            guestService.createGuest(createGuestRequest("Jenö", "Johnson", "jeno.johnson@email.com", "+1-555-1006", GuestTypeEnum.CHILD, "Hungary"));
        }
    }

    private CreateVatRequest createVatRequest(String name, Double percentage) {
        CreateVatRequest request = new CreateVatRequest();
        request.setName(name);
        request.setPercentage(percentage);
        return request;
    }

    private CreateRoleRequest createRoleRequest(String name) {
        CreateRoleRequest request = new CreateRoleRequest();
        request.setName(name);
        request.setImmutable(true);
        return request;
    }

    private CreateAmenityRequest createAmenityRequest(String amenityName) {
        CreateAmenityRequest request = new CreateAmenityRequest();
        request.setAmenityName(amenityName);
        return request;
    }

    private CreateBedTypeRequest createBedTypeRequest(String bedTypeName) {
        CreateBedTypeRequest request = new CreateBedTypeRequest();
        request.setBedTypeName(bedTypeName);
        return request;
    }

    private CreateBuildingRequest createBuildingRequest(String name, String description, String address, String city, String zipcode, String country, String phoneNumber, String email) {
        CreateBuildingRequest request = new CreateBuildingRequest();
        request.setName(name);
        request.setDescription(description);
        request.setAddress(address);
        request.setCity(city);
        request.setZipcode(zipcode);
        request.setCountry(country);
        request.setPhoneNumber(phoneNumber);
        request.setEmail(email);
        return request;
    }

    private CreateGuestTagRequest createGuestTagRequest(String tagName) {
        CreateGuestTagRequest request = new CreateGuestTagRequest();
        request.setTagName(tagName);
        return request;
    }

    private CreateGuestRequest createGuestRequest(String firstName, String lastName, String email, String phoneNumber, GuestTypeEnum type, String homeCountry) {
        CreateGuestRequest request = new CreateGuestRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setPhoneNumber(phoneNumber);
        request.setType(type);
        request.setHomeCountry(homeCountry);
        return request;
    }

    private void initializeServiceModels() {
        if (serviceModelService.getServiceModels(null).isEmpty()) {
            List<Vat> vats = vatService.getVats(null);
            Long standardVatId = vats.stream().filter(v -> v.getName().equals("Standard VAT")).findFirst().get().getId();
            Long luxuryVatId = vats.stream().filter(v -> v.getName().equals("Luxury VAT")).findFirst().get().getId();

            serviceModelService.getOrCreateRoomsCostServiceModel();
            serviceModelService.createServiceModel(createServiceModelRequest("Spa Package", "Relaxing spa treatment", 120.0, luxuryVatId));
            serviceModelService.createServiceModel(createServiceModelRequest("Room Service", "24/7 room service", 45.0, standardVatId));
            serviceModelService.createServiceModel(createServiceModelRequest("Laundry Service", "Express laundry", 25.0, standardVatId));

        }
    }

    private void initializeUsers() {
        if (userService.getUsers(null).isEmpty()) {
            List<Role> roles = roleService.getRoles(null);
            Long adminRoleId = roles.stream().filter(r -> r.getName().equals("Admin")).findFirst().get().getId();
            Long defaultUserRoleId = roles.stream().filter(r -> r.getName().equals("Default User")).findFirst().get().getId();

            User user = userService.createUser(createUserRequest("Admin", "User", "+1-555-23123", "admin@hotel.com", "admin123", List.of(adminRoleId)));
            User user2 = userService.createUser(createUserRequest("Basic", "User", "+1-555-123122", "basic@hotel.com", "pass123", List.of(defaultUserRoleId)));
            userService.activateUser(user.getId());
            userService.activateUser(user2.getId());
        }
    }

    private void initializeRoomTypes() {
        if (roomTypeService.getRoomTypes(null).isEmpty()) {
            List<Amenity> amenities = amenityService.getAmenities(null);
            List<BedType> bedTypes = bedTypeService.getBedTypes(null);

            Long wifiId = amenities.stream().filter(a -> a.getAmenityName().equals("WiFi")).findFirst().get().getId();
            Long airconId = amenities.stream().filter(a -> a.getAmenityName().equals("Air Conditioning")).findFirst().get().getId();
            Long parkingId = amenities.stream().filter(a -> a.getAmenityName().equals("Parking")).findFirst().get().getId();

            Long singleBedId = bedTypes.stream().filter(b -> b.getBedTypeName().equals("Single")).findFirst().get().getId();
            Long doubleBedId = bedTypes.stream().filter(b -> b.getBedTypeName().equals("Double")).findFirst().get().getId();
            Long kingBedId = bedTypes.stream().filter(b -> b.getBedTypeName().equals("King")).findFirst().get().getId();

            roomTypeService.createRoomType(createRoomTypeRequest("Standard Room", 150.0, 2,
                    List.of(wifiId, airconId),
                    List.of(createBedTypeQuantity(doubleBedId, 1))));

            roomTypeService.createRoomType(createRoomTypeRequest("Deluxe Suite", 350.0, 4,
                    List.of(wifiId, airconId, parkingId),
                    List.of(createBedTypeQuantity(kingBedId, 1), createBedTypeQuantity(singleBedId, 1))));

            roomTypeService.createRoomType(createRoomTypeRequest("Executive Room", 250.0, 3,
                    List.of(wifiId, airconId),
                    List.of(createBedTypeQuantity(kingBedId, 1))));

            System.out.println("Initialized 3 room types");
        }
    }

    private void initializeDevLogs() {
        if (devLogRepository.count() == 0) {
            DevLog v1_0 = new DevLog();
            v1_0.setVersion("1.0.0");
            v1_0.setDescription("Initial release with basic hotel management features");
            devLogRepository.saveAll(List.of(v1_0));

            System.out.println("Initialized 1 development log");
        }
    }

    // Level 3 initialization methods
    private void initializeRooms() {
        if (roomService.getRooms(null).isEmpty()) {

            List<Building> buildings = buildingService.getBuildings(null);
            List<RoomType> roomTypes = roomTypeService.getRoomTypes(null);

            Building mainBuilding = buildings.stream().filter(b -> b.getName().equals("Main Building")).findFirst().get();
            Building annexBuilding = buildings.stream().filter(b -> b.getName().equals("Annex Building")).findFirst().get();
            Building suiteBuilding = buildings.stream().filter(b -> b.getName().equals("Suite Building")).findFirst().get();

            RoomType standardRoom = roomTypes.stream().filter(rt -> rt.getTypeName().equals("Standard Room")).findFirst().get();
            RoomType deluxeSuite = roomTypes.stream().filter(rt -> rt.getTypeName().equals("Deluxe Suite")).findFirst().get();
            RoomType executiveRoom = roomTypes.stream().filter(rt -> rt.getTypeName().equals("Executive Room")).findFirst().get();

            // Main Building - Standard Rooms (Floor 1-2)
            roomService.createRoom(createRoomRequest("101", 1, RoomStatusEnum.CLEAN, "Standard room with city view", standardRoom.getId(), mainBuilding.getId()));
            roomService.createRoom(createRoomRequest("102", 1, RoomStatusEnum.CLEAN, "Standard room with garden view", standardRoom.getId(), mainBuilding.getId()));
            roomService.createRoom(createRoomRequest("201", 2, RoomStatusEnum.CLEAN, "Standard room on second floor", standardRoom.getId(), mainBuilding.getId()));
            roomService.createRoom(createRoomRequest("202", 2, RoomStatusEnum.CLEAN, "Standard room with balcony", standardRoom.getId(), mainBuilding.getId()));

            // Annex Building - Executive Rooms (Floor 1-2)
            roomService.createRoom(createRoomRequest("A101", 1, RoomStatusEnum.CLEAN, "Executive room with workspace", executiveRoom.getId(), annexBuilding.getId()));
            roomService.createRoom(createRoomRequest("A102", 1, RoomStatusEnum.CLEAN, "Executive room with lounge area", executiveRoom.getId(), annexBuilding.getId()));
            roomService.createRoom(createRoomRequest("A201", 2, RoomStatusEnum.CLEAN, "Executive room premium view", executiveRoom.getId(), annexBuilding.getId()));

            // Suite Building - Deluxe Suites (Floor 1-3)
            roomService.createRoom(createRoomRequest("S101", 1, RoomStatusEnum.OUT_OF_SERVICE, "Deluxe suite with living room", deluxeSuite.getId(), suiteBuilding.getId()));
            roomService.createRoom(createRoomRequest("S201", 2, RoomStatusEnum.DIRTY, "Deluxe suite with terrace", deluxeSuite.getId(), suiteBuilding.getId()));
            roomService.createRoom(createRoomRequest("S301", 3, RoomStatusEnum.DIRTY, "Penthouse deluxe suite", deluxeSuite.getId(), suiteBuilding.getId()));

            System.out.println("Initialized 10 rooms across 3 buildings");
        }
    }


    // Level 2 helper methods
    private CreateServiceModelRequest createServiceModelRequest(String name, String description, Double cost, Long vatId) {
        CreateServiceModelRequest request = new CreateServiceModelRequest();
        request.setName(name);
        request.setDescription(description);
        request.setCost(cost);
        request.setVatId(vatId);
        return request;
    }

    private CreateUserRequest createUserRequest(String firstName, String lastName, String phone, String email, String password, List<Long> roleIds) {
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setPhone(phone);
        request.setEmail(email);
        request.setPassword(password);
        request.setRoleIds(roleIds);
        return request;
    }

    private CreateRoomTypeRequest createRoomTypeRequest(String typeName, Double price, Integer capacity, List<Long> amenityIds, List<CreateRoomTypeRequest.BedTypeQuantity> bedTypes) {
        CreateRoomTypeRequest request = new CreateRoomTypeRequest();
        request.setTypeName(typeName);
        request.setPrice(price);
        request.setCapacity(capacity);
        request.setAmenityIds(amenityIds);
        request.setBedTypes(bedTypes);
        return request;
    }

    private CreateRoomTypeRequest.BedTypeQuantity createBedTypeQuantity(Long bedTypeId, Integer numBed) {
        CreateRoomTypeRequest.BedTypeQuantity bedTypeQuantity = new CreateRoomTypeRequest.BedTypeQuantity();
        bedTypeQuantity.setBedTypeId(bedTypeId);
        bedTypeQuantity.setNumBed(numBed);
        return bedTypeQuantity;
    }

    // Level 3 helper methods
    private CreateRoomRequest createRoomRequest(String roomNumber, Integer floorNumber, RoomStatusEnum status, String description, Long roomTypeId, Long buildingId) {
        CreateRoomRequest request = new CreateRoomRequest();
        request.setRoomNumber(roomNumber);
        request.setFloorNumber(floorNumber);
        request.setStatus(status);
        request.setDescription(description);
        request.setRoomTypeId(roomTypeId);
        request.setBuildingId(buildingId);
        return request;
    }

    private CreateBookingRequest createBookingRequest(String name, LocalDate startDate, LocalDate endDate, String description, List<Long> roomIds, List<Long> guesIds) {
        CreateBookingRequest request = new CreateBookingRequest();
        request.setName(name);
        request.setDescription(description);
        request.setCheckInDate(startDate);
        request.setCheckOutDate(endDate);
        request.setRoomIds(roomIds);
        request.setGuestIds(guesIds);
        return request;
    }
}