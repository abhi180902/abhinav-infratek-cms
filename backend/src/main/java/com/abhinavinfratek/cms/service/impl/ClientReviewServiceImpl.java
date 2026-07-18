package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.ClientReviewRequest;
import com.abhinavinfratek.cms.dto.ClientReviewResponse;
import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.entity.ClientReview;
import com.abhinavinfratek.cms.exception.ResourceNotFoundException;
import com.abhinavinfratek.cms.mapper.ClientReviewMapper;
import com.abhinavinfratek.cms.repository.ClientReviewRepository;
import com.abhinavinfratek.cms.service.ClientReviewService;
import com.abhinavinfratek.cms.service.ImageStorageService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ClientReviewServiceImpl implements ClientReviewService {

    private static final String CLIENT_REVIEW_IMAGE_FOLDER = "abhinav-infratek/client-reviews";

    private final ClientReviewRepository clientReviewRepository;
    private final ClientReviewMapper clientReviewMapper;
    private final ImageStorageService imageStorageService;

    @Override
    public List<ClientReviewResponse> getActiveClientReviews() {
        return clientReviewRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(clientReviewMapper::toResponse)
                .toList();
    }

    @Override
    public List<ClientReviewResponse> getAllClientReviews() {
        return clientReviewRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(clientReviewMapper::toResponse)
                .toList();
    }

    @Override
    public ClientReviewResponse getClientReviewById(Long id) {
        return clientReviewMapper.toResponse(findClientReviewById(id));
    }

    @Override
    public ClientReviewResponse createClientReview(ClientReviewRequest request) {
        ImageUploadResponse imageResponse = uploadImageIfPresent(request.getImage());
        ClientReview clientReview = clientReviewMapper.toEntity(request, imageResponse);
        return clientReviewMapper.toResponse(clientReviewRepository.save(clientReview));
    }

    @Override
    public ClientReviewResponse updateClientReview(Long id, ClientReviewRequest request) {
        ClientReview clientReview = findClientReviewById(id);
        clientReviewMapper.updateEntity(clientReview, request);

        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            ImageUploadResponse imageResponse = replaceImage(clientReview, image);
            clientReviewMapper.updateImage(clientReview, imageResponse);
        }

        return clientReviewMapper.toResponse(clientReviewRepository.save(clientReview));
    }

    @Override
    public void deleteClientReview(Long id) {
        ClientReview clientReview = findClientReviewById(id);
        if (clientReview.getImagePublicId() != null && !clientReview.getImagePublicId().isBlank()) {
            imageStorageService.deleteImage(clientReview.getImagePublicId());
        }
        clientReviewRepository.delete(clientReview);
    }

    private ClientReview findClientReviewById(Long id) {
        return clientReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client review not found with id: " + id));
    }

    private ImageUploadResponse uploadImageIfPresent(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return null;
        }

        return imageStorageService.uploadImage(image, CLIENT_REVIEW_IMAGE_FOLDER);
    }

    private ImageUploadResponse replaceImage(ClientReview clientReview, MultipartFile image) {
        if (clientReview.getImagePublicId() == null || clientReview.getImagePublicId().isBlank()) {
            return imageStorageService.uploadImage(image, CLIENT_REVIEW_IMAGE_FOLDER);
        }

        return imageStorageService.replaceImage(
                clientReview.getImagePublicId(),
                image,
                CLIENT_REVIEW_IMAGE_FOLDER
        );
    }
}
