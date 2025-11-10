package com.hpms.backend.service.implament;

import com.hpms.backend.dto.AmenityDto;
import com.hpms.backend.dto.BedTypeDto;
import com.hpms.backend.dto.RoomTypeBedTypeDto;
import com.hpms.backend.dto.RoomTypeDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.RoomTypeFilter;
import com.hpms.backend.model.Amenity;
import com.hpms.backend.model.BedType;
import com.hpms.backend.model.RoomType;
import com.hpms.backend.model.RoomTypeBedType;
import com.hpms.backend.repository.AmenityRepository;
import com.hpms.backend.repository.BedTypeRepository;
import com.hpms.backend.repository.RoomTypeBedTypeRepository;
import com.hpms.backend.repository.RoomTypeRepository;
import com.hpms.backend.request.CreateRoomTypeRequest;
import com.hpms.backend.request.UpdateRoomTypeRequest;
import com.hpms.backend.service.inter.IRoomTypeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomTypeService implements IRoomTypeService {
    private final RoomTypeRepository roomTypeRepository;
    private final AmenityRepository amenityRepository;
    private final BedTypeRepository bedTypeRepository;
    private final RoomTypeBedTypeRepository roomTypeBedTypeRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<RoomType> getRoomTypes(RoomTypeFilter filters) {
        if (filters == null) {
            return roomTypeRepository.findAll();
        }

        return roomTypeRepository.findAll().stream()
                .filter(buildRoomTypePredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public RoomType createRoomType(CreateRoomTypeRequest request) {
        Optional<RoomType> existingRoomTypeOpt = roomTypeRepository.findByTypeName(request.getTypeName());
        if (existingRoomTypeOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.ROOM_TYPE_ALREADY_EXISTS.getCode());
        }
        RoomType roomType = new RoomType();
        roomType.setTypeName(request.getTypeName());
        roomType.setPrice(request.getPrice());
        roomType.setCapacity(request.getCapacity());

        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findAllById(request.getAmenityIds());
            if (amenities.size() != request.getAmenityIds().size()) {
                throw new ResourceNotFoundException(FrontEndCodes.AMENITY_NOT_FOUND.getCode());
            }
            roomType.setAmenities(new HashSet<>(amenities));
        }

        RoomType savedRoomType = roomTypeRepository.save(roomType);
        if (request.getBedTypes() != null && !request.getBedTypes().isEmpty()) {
            createBedTypeRelationshipsForCreate(savedRoomType, request.getBedTypes());
        }

        return savedRoomType;
    }

    @Override
    public RoomType updateRoomType(UpdateRoomTypeRequest request, long targetId) {
        Optional<RoomType> existingRoomTypeOpt = roomTypeRepository.findById(targetId);
        if (existingRoomTypeOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.ROOM_TYPE_OBJ_NOT_FOUND.getCode());
        }

        RoomType existingRoomType = existingRoomTypeOpt.get();

        Optional<RoomType> existingName = roomTypeRepository.findByTypeName(request.getTypeName());
        if (existingName.isPresent() && existingName.get().getId() != targetId) {
            throw new AlreadyExistsException(FrontEndCodes.ROOM_TYPE_ALREADY_EXISTS.getCode());
        }

        existingRoomType.setTypeName(request.getTypeName());
        existingRoomType.setPrice(request.getPrice());
        existingRoomType.setCapacity(request.getCapacity());

        if (request.getAmenityIds() != null) {
            if (request.getAmenityIds().isEmpty()) {
                existingRoomType.getAmenities().clear();
            } else {
                List<Amenity> amenities = amenityRepository.findAllById(request.getAmenityIds());

                if (amenities.size() != request.getAmenityIds().size()) {
                    throw new ResourceNotFoundException(FrontEndCodes.AMENITY_NOT_FOUND.getCode());
                }
                existingRoomType.getAmenities().clear();
                existingRoomType.setAmenities(new HashSet<>(amenities));
            }
        }

        roomTypeBedTypeRepository.deleteByRoomType(existingRoomType);
        if (request.getBedTypes() != null && !request.getBedTypes().isEmpty()) {
            createBedTypeRelationshipsForUpdate(existingRoomType, request.getBedTypes());
        }

        return roomTypeRepository.save(existingRoomType);
    }

    @Override
    public void deleteRoomType(long targetId) {
        roomTypeRepository.findById(targetId).ifPresentOrElse(
                roomType -> {
                    if (roomType.getRooms().isEmpty()) {
                        roomTypeRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.ROOM_TYPE_HAS_ROOMS.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.ROOM_TYPE_OBJ_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public RoomTypeDto convertRoomTypeToDto(RoomType roomType) {
        RoomTypeDto dto = modelMapper.map(roomType, RoomTypeDto.class);

        List<AmenityDto> amenityDtos = roomType.getAmenities().stream()
                .map(amenity -> modelMapper.map(amenity, AmenityDto.class))
                .collect(Collectors.toList());
        dto.setAmenities(amenityDtos);

        List<RoomTypeBedType> roomTypeBedTypes = roomTypeBedTypeRepository.findByRoomType(roomType);
        List<RoomTypeBedTypeDto> bedTypeDtos = roomTypeBedTypes.stream()
                .map(this::convertRoomTypeBedTypeToDto)
                .collect(Collectors.toList());
        dto.setBedTypes(bedTypeDtos);

        return dto;
    }

    @Override
    public Predicate<RoomType> buildRoomTypePredicate(RoomTypeFilter filters) {
        Predicate<RoomType> predicate = roomType -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(roomType -> roomType.getId() == filters.getId());
        }

        if (filters.getTypeName() != null && !filters.getTypeName().isEmpty()) {
            predicate = predicate.and(roomType ->
                    roomType.getTypeName().toLowerCase().contains(filters.getTypeName().toLowerCase()));
        }

        if (filters.getMinPrice() != null) {
            predicate = predicate.and(roomType -> roomType.getPrice() >= filters.getMinPrice());
        }

        if (filters.getMaxPrice() != null) {
            predicate = predicate.and(roomType -> roomType.getPrice() <= filters.getMaxPrice());
        }

        if (filters.getMinCapacity() != null) {
            predicate = predicate.and(roomType -> roomType.getCapacity() >= filters.getMinCapacity());
        }

        if (filters.getMaxCapacity() != null) {
            predicate = predicate.and(roomType -> roomType.getCapacity() <= filters.getMaxCapacity());
        }

        if (filters.getAmenityIds() != null && !filters.getAmenityIds().isEmpty()) {
            predicate = predicate.and(roomType ->
                    roomType.getAmenities().stream()
                            .anyMatch(amenity -> filters.getAmenityIds().contains(amenity.getId())));
        }

        if (filters.getBedTypeIds() != null && !filters.getBedTypeIds().isEmpty()) {
            predicate = predicate.and(roomType -> {

                List<RoomTypeBedType> roomTypeBedTypes = roomTypeBedTypeRepository.findByRoomType(roomType);
                return roomTypeBedTypes.stream()
                        .anyMatch(rtbt -> filters.getBedTypeIds().contains(rtbt.getBedType().getId()));
            });
        }

        return predicate;
    }

    private void createBedTypeRelationshipsForCreate(RoomType roomType, List<CreateRoomTypeRequest.BedTypeQuantity> bedTypeQuantities) {
        for (CreateRoomTypeRequest.BedTypeQuantity bedTypeQuantity : bedTypeQuantities) {

            Optional<BedType> bedTypeOpt = bedTypeRepository.findById(bedTypeQuantity.getBedTypeId());
            if (bedTypeOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.BED_TYPE_NOT_FOUND.getCode());
            }

            RoomTypeBedType roomTypeBedType = new RoomTypeBedType();
            roomTypeBedType.setRoomType(roomType);
            roomTypeBedType.setBedType(bedTypeOpt.get());
            roomTypeBedType.setNumBed(bedTypeQuantity.getNumBed());

            roomTypeBedTypeRepository.save(roomTypeBedType);
        }
    }

    private void createBedTypeRelationshipsForUpdate(RoomType roomType, List<UpdateRoomTypeRequest.BedTypeQuantity> bedTypeQuantities) {
        for (UpdateRoomTypeRequest.BedTypeQuantity bedTypeQuantity : bedTypeQuantities) {

            Optional<BedType> bedTypeOpt = bedTypeRepository.findById(bedTypeQuantity.getBedTypeId());
            if (bedTypeOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.BED_TYPE_NOT_FOUND.getCode());
            }

            RoomTypeBedType roomTypeBedType = new RoomTypeBedType();
            roomTypeBedType.setRoomType(roomType);
            roomTypeBedType.setBedType(bedTypeOpt.get());
            roomTypeBedType.setNumBed(bedTypeQuantity.getNumBed());

            roomTypeBedTypeRepository.save(roomTypeBedType);
        }
    }

    private RoomTypeBedTypeDto convertRoomTypeBedTypeToDto(RoomTypeBedType roomTypeBedType) {
        RoomTypeBedTypeDto dto = new RoomTypeBedTypeDto();
        dto.setId(roomTypeBedType.getId());
        dto.setNumBed(roomTypeBedType.getNumBed());
        dto.setBedType(modelMapper.map(roomTypeBedType.getBedType(), BedTypeDto.class));
        return dto;
    }
}