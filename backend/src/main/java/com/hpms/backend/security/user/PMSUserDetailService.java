package com.hpms.backend.security.user;

import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.model.User;
import com.hpms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PMSUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    /**
     * Felhasználó betöltése email cím alapján.
     * A Spring Security hívja meg az autentikáció során.
     * @param email A felhasználó email címe
     * @return A felhasználó részletei (PMSUserDetails)
     * @throws UsernameNotFoundException ha a felhasználó nem található
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return PMSUserDetails.buildUserDetails(user);
    }
}
