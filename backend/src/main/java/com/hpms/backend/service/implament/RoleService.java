package com.hpms.backend.service.implament;

import com.hpms.backend.dto.RoleDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.RoleFilter;
import com.hpms.backend.model.Role;
import com.hpms.backend.repository.RoleRepository;
import com.hpms.backend.request.CreateRoleRequest;
import com.hpms.backend.request.UpdateRoleRequest;
import com.hpms.backend.service.inter.IRoleService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Role> getRoles(RoleFilter filters) {
        if (filters == null) {
            return roleRepository.findAll();
        }

        return roleRepository.findAll().stream()
                .filter(buildRolePredicate(filters))
                .collect(Collectors.toList());
    }


    @Override
    public Role createRole(CreateRoleRequest request) {

        Optional<Role> existingRoleOpt = roleRepository.findByName(request.getName());

        if (existingRoleOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.ROLE_ALREADY_EXISTS.getCode());
        }

        Role role = new Role();
        role.setName(request.getName());
        role.setImmutable(request.getImmutable() != null ? request.getImmutable() : false);

        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(UpdateRoleRequest request, long targetId) {

        Optional<Role> existingRoleOpt = roleRepository.findFirstById(targetId);
        if (existingRoleOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.ROLE_NOT_FOUND.getCode());
        }

        Role existingRole = existingRoleOpt.get();

        if(existingRole.getImmutable() == true) throw new IllegalStateException(FrontEndCodes.ROLE_IS_IMMUTABLE.getCode());

        Optional<Role> existingName = roleRepository.findByName(request.getName());

        if (existingName.isPresent() && existingName.get().getId() != existingRole.getId()) {
            throw new AlreadyExistsException(FrontEndCodes.ROLE_ALREADY_EXISTS.getCode());
        }

        existingRole.setName(request.getName());
        return roleRepository.save(existingRole);
    }

    @Override
    public void deleteRole(long targetId) {
        roleRepository.findById(targetId).ifPresentOrElse(
                x -> {
                    if(x.getImmutable() == true) {throw new IllegalStateException(FrontEndCodes.ROLE_IS_IMMUTABLE.getCode());}

                    if (x.getUsers().isEmpty()) {
                        roleRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.ROLE_HAS_USERS.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.ROLE_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDto convertRoleToDto(Role role) {
        return modelMapper.map(role, RoleDto.class);
    }

    @Override
    public Predicate<Role> buildRolePredicate(RoleFilter filters) {
        Predicate<Role> predicate = role -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(role -> role.getId() == filters.getId());
        }

        if (filters.getName() != null && !filters.getName().isEmpty()) {
            predicate = predicate.and(role ->
                    role.getName().toLowerCase().contains(filters.getName().toLowerCase()));
        }

        return predicate;
    }
}