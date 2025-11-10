package com.hpms.backend.service.implament;

import com.hpms.backend.dto.RoleDto;
import com.hpms.backend.dto.UserDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.UserFilter;
import com.hpms.backend.model.Role;
import com.hpms.backend.model.User;
import com.hpms.backend.repository.RoleRepository;
import com.hpms.backend.repository.UserRepository;
import com.hpms.backend.request.CreateUserRequest;
import com.hpms.backend.request.UpdateUserRequest;
import com.hpms.backend.service.inter.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    @Override
    public List<User> getUsers(UserFilter filters) {
        if (filters == null) {
            return userRepository.findAll();
        }

        return userRepository.findAll().stream()
                .filter(buildUserPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public User createUser(CreateUserRequest request) {
        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = new User();
                    user.setEmail(request.getEmail());
                    user.setFirstName(request.getFirstName());
                    user.setLastName(request.getLastName());
                    user.setPhone(request.getPhone());
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    user.setActive(false);
                   
                    Set<Role> roles = assignRoles(request.getRoleIds());
                    user.getRoles().addAll(roles);

                    return userRepository.save(user);
                }).orElseThrow(() -> new AlreadyExistsException(FrontEndCodes.COMMON_ALREADY_EXISTS.getCode()));
    }

    @Override
    public User updateUser(UpdateUserRequest request, long userId) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            existingUser.setPhone(request.getPhone());

            if (request.getRoleIds() != null) {
                Set<Role> newRoles = assignRoles(request.getRoleIds());
                existingUser.getRoles().clear();
                existingUser.getRoles().addAll(newRoles);
            }

            return userRepository.save(existingUser);
        }).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.COMMON_RESOURCE_NOT_FOUND.getCode()));
    }

    @Override
    public void activateUser(long userID){
        userRepository.findById(userID).ifPresentOrElse(user -> {
            user.setActive(true);
            userRepository.save(user);
        }, () -> {
            throw new ResourceNotFoundException(FrontEndCodes.COMMON_RESOURCE_NOT_FOUND.getCode());
        });
    }

    @Override
    public void deActivateUser(long userID){
        userRepository.findById(userID).ifPresentOrElse(user -> {
            user.setActive(false);
            userRepository.save(user);
        }, () -> {
            throw new ResourceNotFoundException(FrontEndCodes.COMMON_RESOURCE_NOT_FOUND.getCode());
        });
    }


    @Override
    public void deleteUser(long userId) {
        userRepository.findById(userId).ifPresentOrElse(userRepository::delete, () -> {
            throw new ResourceNotFoundException(FrontEndCodes.COMMON_RESOURCE_NOT_FOUND.getCode());
        });
    }

    @Override
    public UserDto convertUserToDto(User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
        if (user.getRoles() != null) {
            List<RoleDto> roleDos = user.getRoles().stream()
                    .map(role -> modelMapper.map(role, RoleDto.class))
                    .toList();
            userDto.setRoles(roleDos);
        }
        return userDto;
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.COMMON_RESOURCE_NOT_FOUND.getCode()));
    }

    @Override
    public Predicate<User> buildUserPredicate(UserFilter filters) {
        Predicate<User> predicate = user -> true;

        if (filters.getId() != 0) {
            predicate = predicate.and(user -> user.getId() == filters.getId());
        }

        if (filters.getFirstName() != null && !filters.getFirstName().isEmpty()) {
            predicate = predicate.and(user ->
                    user.getFirstName().toLowerCase().contains(filters.getFirstName().toLowerCase()));
        }

        if (filters.getLastName() != null && !filters.getLastName().isEmpty()) {
            predicate = predicate.and(user ->
                    user.getLastName().toLowerCase().contains(filters.getLastName().toLowerCase()));
        }

        if (filters.getEmail() != null && !filters.getEmail().isEmpty()) {
            predicate = predicate.and(user ->
                    user.getEmail().toLowerCase().contains(filters.getEmail().toLowerCase()));
        }

        if (filters.getPhone() != null && !filters.getPhone().isEmpty()) {
            predicate = predicate.and(user -> user.getPhone().contains(filters.getPhone()));
        }

        if (filters.getRoleIds() != null && !filters.getRoleIds().isEmpty()) {
            predicate = predicate.and(user -> user.getRoles().stream()
                    .anyMatch(userRole -> filters.getRoleIds().contains(userRole.getId())));
        }

        return predicate;
    }

    private Set<Role> assignRoles(List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return Set.of();
        }

        List<Role> roles = roleRepository.findAllById(roleIds);
        if (roles.size() != roleIds.size()) {
            throw new ResourceNotFoundException(FrontEndCodes.ROLE_NOT_FOUND.getCode());
        }

        return Set.copyOf(roles);
    }
}
