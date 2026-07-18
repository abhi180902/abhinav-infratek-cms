package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.exception.ImageUploadException;
import com.abhinavinfratek.cms.service.ImageStorageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CloudinaryImageStorageService implements ImageStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_FORMATS = Set.of("jpg", "jpeg", "png", "webp");

    private final Cloudinary cloudinary;

    @Override
    public ImageUploadResponse uploadImage(MultipartFile file, String folder) {
        validateImage(file);

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", normalizeFolder(folder),
                    "resource_type", "image"
            ));

            return toResponse(uploadResult, file.getOriginalFilename());
        } catch (IOException exception) {
            throw new ImageUploadException("Unable to read image file", exception);
        } catch (RuntimeException exception) {
            throw new ImageUploadException("Image upload failed", exception);
        }
    }

    @Override
    public boolean deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            throw new ImageUploadException("Public ID is required to delete an image");
        }

        try {
            Map<?, ?> deleteResult = cloudinary.uploader().destroy(publicId.trim(), ObjectUtils.emptyMap());
            return "ok".equals(deleteResult.get("result"));
        } catch (IOException exception) {
            throw new ImageUploadException("Image deletion failed", exception);
        } catch (RuntimeException exception) {
            throw new ImageUploadException("Image deletion failed", exception);
        }
    }

    @Override
    public ImageUploadResponse replaceImage(String oldPublicId, MultipartFile newFile, String folder) {
        ImageUploadResponse uploadResponse = uploadImage(newFile, folder);

        if (oldPublicId != null && !oldPublicId.isBlank()) {
            deleteImage(oldPublicId);
        }

        return uploadResponse;
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ImageUploadException("Image file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ImageUploadException("Image file size must not exceed 5 MB");
        }

        String format = extractFormat(file.getOriginalFilename());
        if (!ALLOWED_FORMATS.contains(format)) {
            throw new ImageUploadException("Only jpg, jpeg, png, and webp image files are allowed");
        }
    }

    private String extractFormat(String filename) {
        if (filename == null || filename.isBlank() || !filename.contains(".")) {
            return "";
        }

        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
    }

    private String normalizeFolder(String folder) {
        if (folder == null || folder.isBlank()) {
            return "abhinav-infratek";
        }

        return folder.trim();
    }

    private ImageUploadResponse toResponse(Map<?, ?> uploadResult, String originalFilename) {
        return ImageUploadResponse.builder()
                .secureUrl(asString(uploadResult.get("secure_url")))
                .publicId(asString(uploadResult.get("public_id")))
                .originalFilename(originalFilename)
                .width(asInteger(uploadResult.get("width")))
                .height(asInteger(uploadResult.get("height")))
                .format(asString(uploadResult.get("format")))
                .bytes(asLong(uploadResult.get("bytes")))
                .build();
    }

    private String asString(Object value) {
        return value == null ? null : value.toString();
    }

    private Integer asInteger(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }

        return null;
    }

    private Long asLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }

        return null;
    }
}
