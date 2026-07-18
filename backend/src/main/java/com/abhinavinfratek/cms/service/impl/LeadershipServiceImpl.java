package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.dto.LeadershipRequest;
import com.abhinavinfratek.cms.dto.LeadershipResponse;
import com.abhinavinfratek.cms.entity.Leadership;
import com.abhinavinfratek.cms.exception.ImageUploadException;
import com.abhinavinfratek.cms.exception.ResourceNotFoundException;
import com.abhinavinfratek.cms.mapper.LeadershipMapper;
import com.abhinavinfratek.cms.repository.LeadershipRepository;
import com.abhinavinfratek.cms.service.ImageStorageService;
import com.abhinavinfratek.cms.service.LeadershipService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class LeadershipServiceImpl implements LeadershipService {

    private static final String LEADERSHIP_IMAGE_FOLDER = "abhinav-infratek/leadership";

    private final LeadershipRepository leadershipRepository;
    private final LeadershipMapper leadershipMapper;
    private final ImageStorageService imageStorageService;

    @Override
    public List<LeadershipResponse> getActiveLeadershipMembers() {
        return leadershipRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(leadershipMapper::toResponse)
                .toList();
    }

    @Override
    public List<LeadershipResponse> getAllLeadershipMembers() {
        return leadershipRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(leadershipMapper::toResponse)
                .toList();
    }

    @Override
    public LeadershipResponse getLeadershipMemberById(Long id) {
        return leadershipMapper.toResponse(findLeadershipMemberById(id));
    }

    @Override
    public LeadershipResponse createLeadershipMember(LeadershipRequest request) {
        MultipartFile image = request.getImage();
        if (image == null || image.isEmpty()) {
            throw new ImageUploadException("Leadership image is required");
        }

        ImageUploadResponse imageResponse = imageStorageService.uploadImage(image, LEADERSHIP_IMAGE_FOLDER);
        Leadership leadership = leadershipMapper.toEntity(request, imageResponse);
        return leadershipMapper.toResponse(leadershipRepository.save(leadership));
    }

    @Override
    public LeadershipResponse updateLeadershipMember(Long id, LeadershipRequest request) {
        Leadership leadership = findLeadershipMemberById(id);
        leadershipMapper.updateEntity(leadership, request);

        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            ImageUploadResponse imageResponse = imageStorageService.replaceImage(
                    leadership.getImagePublicId(),
                    image,
                    LEADERSHIP_IMAGE_FOLDER
            );
            leadershipMapper.updateImage(leadership, imageResponse);
        }

        return leadershipMapper.toResponse(leadershipRepository.save(leadership));
    }

    @Override
    public void deleteLeadershipMember(Long id) {
        Leadership leadership = findLeadershipMemberById(id);
        imageStorageService.deleteImage(leadership.getImagePublicId());
        leadershipRepository.delete(leadership);
    }

    private Leadership findLeadershipMemberById(Long id) {
        return leadershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leadership member not found with id: " + id));
    }
}
