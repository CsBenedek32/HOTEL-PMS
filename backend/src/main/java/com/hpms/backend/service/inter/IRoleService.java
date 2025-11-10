package com.hpms.backend.service.inter;


import com.hpms.backend.dto.RoleDto;
import com.hpms.backend.filter.RoleFilter;
import com.hpms.backend.model.Role;
import com.hpms.backend.request.CreateRoleRequest;
import com.hpms.backend.request.UpdateRoleRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IRoleService {

    List<Role> getRoles(RoleFilter filters);

    Role createRole(CreateRoleRequest request);

    Role updateRole(UpdateRoleRequest request, long targetId);

    void deleteRole(long targetId);

    RoleDto convertRoleToDto(Role role);

    Predicate<Role> buildRolePredicate(RoleFilter filters);
}
