package com.hpms.backend.service.implament;

import com.hpms.backend.dto.BuildingDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.BuildingFilter;
import com.hpms.backend.model.Building;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.User;
import com.hpms.backend.repository.BuildingRepository;
import com.hpms.backend.repository.UserRepository;
import com.hpms.backend.request.CreateBuildingRequest;
import com.hpms.backend.request.UpdateBuildingRequest;
import com.hpms.backend.service.inter.IBuildingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BuildingService implements IBuildingService {
    private final BuildingRepository buildingRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Building> getBuildings(BuildingFilter filters) {
        if (filters == null) {
            return buildingRepository.findAll();
        }

        return buildingRepository.findAll().stream()
                .filter(buildBuildingPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public Building createBuilding(CreateBuildingRequest request) {
        return Optional.of(request)
                .filter(building -> !buildingRepository.existsByName(request.getName()))
                .map(req -> {
                    Building building = new Building();
                    building.setName(request.getName());
                    building.setAddress(request.getAddress());
                    building.setCity(request.getCity());
                    building.setZipcode(request.getZipcode());
                    building.setDescription(request.getDescription());
                    building.setCountry(request.getCountry());
                    building.setPhoneNumber(request.getPhoneNumber());
                    building.setEmail(request.getEmail());
                    return buildingRepository.save(building);
                }).orElseThrow(() -> new AlreadyExistsException(FrontEndCodes.BUILDING_ALREADY_EXISTS.getCode()));
    }

    @Override
    public Building updateBuilding(UpdateBuildingRequest request, long buildingId) {
        return buildingRepository.findById(buildingId).map(existingBuilding -> {
            existingBuilding.setName(request.getName());
            existingBuilding.setAddress(request.getAddress());
            existingBuilding.setCity(request.getCity());
            existingBuilding.setZipcode(request.getZipcode());
            existingBuilding.setDescription(request.getDescription());
            existingBuilding.setCountry(request.getCountry());
            existingBuilding.setPhoneNumber(request.getPhoneNumber());
            existingBuilding.setEmail(request.getEmail());

            if (request.getActive() != null) {
                existingBuilding.setActive(request.getActive());
            }

            return buildingRepository.save(existingBuilding);
        }).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.BUILDING_NOT_FOUND.getCode()));
    }

    @Override
    public void deleteBuilding(long buildingId) {
        buildingRepository.findById(buildingId).ifPresentOrElse(building -> {
            if (building.getRooms() != null && !building.getRooms().isEmpty()) {
                throw new IllegalStateException(FrontEndCodes.BUILDING_HAS_ROOMS.getCode());
            }
            buildingRepository.delete(building);
        }, () -> {
            throw new ResourceNotFoundException(FrontEndCodes.BUILDING_NOT_FOUND.getCode());
        });
    }

    @Override
    public BuildingDto convertBuildingToDto(Building building) {
        BuildingDto buildingDto = modelMapper.map(building, BuildingDto.class);
        if (building.getUsers() != null) {
            List<Long> userIds = building.getUsers().stream()
                    .map(User::getId)
                    .toList();
            buildingDto.setUserIds(userIds);
        }
        if (building.getRooms() != null) {
            List<Long> roomIds = building.getRooms().stream()
                    .map(Room::getId)
                    .toList();
            buildingDto.setRoomIds(roomIds);
        }
        return buildingDto;
    }

    @Override
    public Predicate<Building> buildBuildingPredicate(BuildingFilter filters) {
        Predicate<Building> predicate = building -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(building -> building.getId().equals(filters.getId()));
        }

        if (filters.getName() != null && !filters.getName().isEmpty()) {
            predicate = predicate.and(building ->
                    building.getName().toLowerCase().contains(filters.getName().toLowerCase()));
        }

        if (filters.getAddress() != null && !filters.getAddress().isEmpty()) {
            predicate = predicate.and(building ->
                    building.getAddress() != null && building.getAddress().toLowerCase().contains(filters.getAddress().toLowerCase()));
        }

        if (filters.getCity() != null && !filters.getCity().isEmpty()) {
            predicate = predicate.and(building ->
                    building.getCity() != null && building.getCity().toLowerCase().contains(filters.getCity().toLowerCase()));
        }

        if (filters.getZipcode() != null && !filters.getZipcode().isEmpty()) {
            predicate = predicate.and(building ->
                    building.getZipcode() != null && building.getZipcode().contains(filters.getZipcode()));
        }

        if (filters.getCountry() != null && !filters.getCountry().isEmpty()) {
            predicate = predicate.and(building ->
                    building.getCountry() != null && building.getCountry().toLowerCase().contains(filters.getCountry().toLowerCase()));
        }

        if (filters.getActive() != null) {
            predicate = predicate.and(building -> building.getActive().equals(filters.getActive()));
        }

        if (filters.getUserIds() != null && !filters.getUserIds().isEmpty()) {
            predicate = predicate.and(building -> building.getUsers().stream()
                    .anyMatch(user -> filters.getUserIds().contains(user.getId())));
        }

        return predicate;
    }

    private Set<User> assignUsers(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Set.of();
        }

        List<User> users = userRepository.findAllById(userIds);
        if (users.size() != userIds.size()) {
            throw new ResourceNotFoundException(FrontEndCodes.COMMON_RESOURCE_NOT_FOUND.getCode());
        }

        return Set.copyOf(users);
    }
}