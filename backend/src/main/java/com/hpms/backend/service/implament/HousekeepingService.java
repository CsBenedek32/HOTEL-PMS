package com.hpms.backend.service.implament;

import com.hpms.backend.dto.HousekeepingDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import com.hpms.backend.enumCollection.RoomStatusEnum;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.model.Housekeeping;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.User;
import com.hpms.backend.repository.HousekeepingRepository;
import com.hpms.backend.repository.RoomRepository;
import com.hpms.backend.repository.UserRepository;
import com.hpms.backend.request.CreateHousekeepingRequest;
import com.hpms.backend.request.UpdateHousekeepingRequest;
import com.hpms.backend.service.inter.IHousekeepingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class HousekeepingService implements IHousekeepingService {
    private final HousekeepingRepository housekeepingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Housekeeping> getHousekeepings() {
            return housekeepingRepository.findAll();
    }

    @Override
    public Housekeeping createHousekeeping(CreateHousekeepingRequest request) {
        Optional<Room> roomOpt = roomRepository.findById(request.getRoomId());
        if (roomOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.HOUSEKEEPING_ROOM_NOT_FOUND.getCode());
        }

        Housekeeping housekeeping = new Housekeeping();
        housekeeping.setRoom(roomOpt.get());
        housekeeping.setNote(request.getNote());
        housekeeping.setPriority(request.getPriority());
        housekeeping.setStatus(HousekeepingStatus.TO_DO);


        if (request.getUserId() != null) {
            Optional<User> userOpt = userRepository.findById(request.getUserId());

            if (userOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.HOUSEKEEPING_USER_NOT_FOUND.getCode());
            }
            housekeeping.setUser(userOpt.get());
            housekeeping.setAssignedDate(LocalDate.now());
        }

        return housekeepingRepository.save(housekeeping);
    }

    @Override
    public Housekeeping updateHousekeeping(UpdateHousekeepingRequest request, long targetId) {
        Optional<Housekeeping> existingHousekeepingOpt = housekeepingRepository.findById(targetId);
        if (existingHousekeepingOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.HOUSEKEEPING_NOT_FOUND.getCode());
        }

        Housekeeping existingHousekeeping = existingHousekeepingOpt.get();

        existingHousekeeping.setNote(request.getNote());
        existingHousekeeping.setPriority(request.getPriority());


        if (request.getUserId() != null) {
            Optional<User> userOpt = userRepository.findById(request.getUserId());

            if (userOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.HOUSEKEEPING_USER_NOT_FOUND.getCode());
            }
            existingHousekeeping.setUser(userOpt.get());
            existingHousekeeping.setAssignedDate(LocalDate.now());
        }

        if (request.getRoomId() != null) {
            Optional<Room> roomOpt = roomRepository.findById(request.getRoomId());
            if (roomOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.HOUSEKEEPING_ROOM_NOT_FOUND.getCode());
            }
            existingHousekeeping.setRoom(roomOpt.get());
        }

        return housekeepingRepository.save(existingHousekeeping);
    }

    @Override
    public Housekeeping updateHouseKeepingStatus(HousekeepingStatus status, long targetId) {
        Optional<Housekeeping> existingHousekeepingOpt = housekeepingRepository.findById(targetId);
        if (existingHousekeepingOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.HOUSEKEEPING_NOT_FOUND.getCode());
        }

        Housekeeping existingHousekeeping = existingHousekeepingOpt.get();
        existingHousekeeping.setStatus(status);
        Room r = existingHousekeeping.getRoom();

        if(status.equals(HousekeepingStatus.DONE)) {
            existingHousekeeping.setCompletionDate(LocalDate.now());

            r.setStatus(RoomStatusEnum.CLEAN);

        }
        else{
            existingHousekeeping.setCompletionDate(null);
            r.setStatus(RoomStatusEnum.DIRTY);
        }

        roomRepository.save(r);
        return housekeepingRepository.save(existingHousekeeping);
    }


    @Override
    public void deleteHousekeeping(long targetId) {
        housekeepingRepository.findById(targetId).ifPresentOrElse(
                housekeeping -> housekeepingRepository.deleteById(targetId),
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.HOUSEKEEPING_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public HousekeepingDto convertHousekeepingToDto(Housekeeping housekeeping) {
        return modelMapper.map(housekeeping, HousekeepingDto.class);
    }
}