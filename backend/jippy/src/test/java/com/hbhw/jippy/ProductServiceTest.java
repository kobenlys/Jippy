package com.hbhw.jippy;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.ProductCategory;
import com.hbhw.jippy.domain.product.enums.ProductSize;
import com.hbhw.jippy.domain.product.enums.ProductType;
import com.hbhw.jippy.domain.product.repository.ProductRepository;
import com.hbhw.jippy.domain.product.service.ProductCategoryService;
import com.hbhw.jippy.domain.product.service.ProductService;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.service.StoreService;
import com.hbhw.jippy.utils.UUIDProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private StoreService storeService;

    @Mock
    private ProductCategoryService productCategoryService;

    @Mock
    private S3Client s3Client;

    @Mock
    private UUIDProvider uuidProvider;

    @Mock
    private MultipartFile mockFile; // Mock MultipartFile

    @Value("${cloud.aws.s3.bucket}")
    private String s3BucketName;

    @Value("${cloud.aws.s3.bucket.base.url}")
    private String s3BaseUrl;
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    @Test
    void testCreateProduct_withImage() throws Exception {
        // Given
        CreateProductRequest request = new CreateProductRequest();
        request.setName("커피");
        request.setPrice(4000);
        request.setStoreId(1);
        request.setProductCategoryId(1);
        request.setStatus(true);
        request.setProductType(ProductType.ICE);
        request.setProductSize(ProductSize.M);

        // Create a mock MultipartFile (image)
        MockMultipartFile mockFile = new MockMultipartFile("image", "coffee.jpg", "image/jpeg", new byte[0]);

        // Mock external dependencies
        Store store = new Store();
        ProductCategory productCategory = new ProductCategory();
        when(productCategoryService.getProductCategoryEntity(anyInt(), anyInt())).thenReturn(productCategory);
        when(uuidProvider.generateUUID()).thenReturn("12345");

//        PutObjectResponse putObjectResponse = PutObjectResponse.builder().build(); // Simulating a successful response from S3
//        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
//                .thenReturn(putObjectResponse);  // Simulate successful S3 upload


        // When
        productService.createProduct(request, mockFile);

        // Then
        // Verify that the productRepository.save() method was called
        verify(productRepository, times(1)).save(any(Product.class));

        // Optionally, verify that the image URL is correctly generated (if it's part of the product)
        // If the S3 image URL is created, we would also want to confirm that the image URL is set.
    }


}
