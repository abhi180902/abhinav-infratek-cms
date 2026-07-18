package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    ImageUploadResponse uploadImage(MultipartFile file, String folder);

    boolean deleteImage(String publicId);

    ImageUploadResponse replaceImage(String oldPublicId, MultipartFile newFile, String folder);
}
