package com.hpms.backend.service.inter;

import com.hpms.backend.dto.UserDto;
import com.hpms.backend.filter.UserFilter;
import com.hpms.backend.model.User;
import com.hpms.backend.request.CreateUserRequest;
import com.hpms.backend.request.UpdateUserRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IUserService {

    List<User> getUsers(UserFilter filters);

    User createUser(CreateUserRequest request);

    User updateUser(UpdateUserRequest request, long targetId);

    void activateUser(long userID);

    void deActivateUser(long userID);

    void deleteUser(long targetId);

    UserDto convertUserToDto(User user);

    User getAuthenticatedUser();

    Predicate<User> buildUserPredicate(UserFilter filters);
}
