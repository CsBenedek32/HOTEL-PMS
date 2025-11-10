package com.hpms.backend.service.inter;

import com.hpms.backend.dto.BuildingDto;
import com.hpms.backend.filter.BuildingFilter;
import com.hpms.backend.model.Building;
import com.hpms.backend.request.CreateBuildingRequest;
import com.hpms.backend.request.UpdateBuildingRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IBuildingService {
    List<Building> getBuildings(BuildingFilter filters);
    Building createBuilding(CreateBuildingRequest request);
    Building updateBuilding(UpdateBuildingRequest request, long buildingId);
    void deleteBuilding(long buildingId);
    BuildingDto convertBuildingToDto(Building building);
    Predicate<Building> buildBuildingPredicate(BuildingFilter filters);
}