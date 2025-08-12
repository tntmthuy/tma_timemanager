package com.timesphere.timesphere.service;

import com.timesphere.timesphere.dao.SearchRequest;
import com.timesphere.timesphere.dao.UserSearchDao;
import com.timesphere.timesphere.dto.auth.ChangePasswordRequest;
import com.timesphere.timesphere.dto.user.UpdateProfileRequest;
import com.timesphere.timesphere.dto.user.UserSuggestionResponse;
import com.timesphere.timesphere.entity.User;
import com.timesphere.timesphere.exception.AppException;
import com.timesphere.timesphere.exception.ErrorCode;
import com.timesphere.timesphere.exception.UserNotFoundException;
import com.timesphere.timesphere.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }

    public void changePassword(ChangePasswordRequest request, Principal connectUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectUser).getPrincipal();

        // the current password not right
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }

        // the two new password are not the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new AppException(ErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
        }

        // save the new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }


    public List<UserSuggestionResponse> searchUsersForNewTeam(String keyword) {
        List<User> users = (keyword == null || keyword.isBlank())
                ? userRepository.suggestUsersForNewTeamDefault()
                : userRepository.searchUsersForNewTeam(keyword);

        return users.stream()
                .map(u -> new UserSuggestionResponse(
                        u.getId(),
                        Stream.of(u.getFirstname(), u.getLastname())
                                .filter(Objects::nonNull)
                                .collect(Collectors.joining(" ")),
                        u.getEmail(),
                        u.getAvatarUrl()
                ))
                .toList();
    }

    //cập nhật profile
    @Transactional
    public User updateProfile(User currentUser, UpdateProfileRequest req) {
        Optional.ofNullable(req.getFirstname()).ifPresent(currentUser::setFirstname);
        Optional.ofNullable(req.getLastname()).ifPresent(currentUser::setLastname);
        Optional.ofNullable(req.getGender()).ifPresent(currentUser::setGender);

        return userRepository.save(currentUser);
    }

    // cập nhật avatar
    @Transactional
    public User changeAvatar(User user, String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) {
            throw new AppException(ErrorCode.INVALID_KEY, "URL avatar không hợp lệ");
        }
        user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }
}
