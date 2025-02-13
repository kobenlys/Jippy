package com.hbhw.jippy;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.request.ProductUpdateRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.ProductCategory;
import com.hbhw.jippy.domain.product.enums.ProductSize;
import com.hbhw.jippy.domain.product.enums.ProductType;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.ProductRepository;
import com.hbhw.jippy.domain.product.service.ProductCategoryService;
import com.hbhw.jippy.domain.product.service.ProductService;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.service.StoreService;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.enums.StaffType;
import com.hbhw.jippy.utils.UUIDProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@MockitoSettings(strictness = Strictness.LENIENT)
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
    @DisplayName("매장별 상품 등록")
    void testCreateProduct() throws Exception {
        // Given
        CreateProductRequest request = new CreateProductRequest();
        request.setName("커피");
        request.setPrice(4000);
        request.setStoreId(1);
        request.setProductCategoryId(1);
        request.setStatus(true);
        request.setProductType(ProductType.ICE);
        request.setProductSize(ProductSize.M);

        MockMultipartFile mockFile = new MockMultipartFile("image", "coffee.jpg", "image/jpeg", new byte[0]);
        Store store = new Store();
        ProductCategory productCategory = new ProductCategory();
        when(productCategoryService.getProductCategoryEntity(anyInt(), anyInt())).thenReturn(productCategory);
        when(uuidProvider.generateUUID()).thenReturn("12345");

        // When
        productService.createProduct(request, mockFile);
        // Then
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("매장별 상품 목록 조회 - 정상 케이스")
    void getListAllProduct_Success() {
        // Given
        UserOwner mockUserOwner1 = new UserOwner("owner1@example.com", "password1", "김싸피", "1999-01-15", StaffType.OWNER, "fcmToken1");
        // UserOwner mockUserOwner2 = new UserOwner("owner2@example.com", "password2", "이싸피", "1900-01-15", StaffType.OWNER, "fcmToken2");

        Store mockStore = Store.builder()
                .id(1)  // 매장 ID
                .userOwner(mockUserOwner1)  // 점주 정보
                .name("테스트 매장")
                .address("서울특별시 강남구 테헤란로 123")
                .openingDate("2024-01-01")
                .totalCash(1000000)
                .businessRegistrationNumber("123-45-67890")
                .build();


        Product product1 = Product.builder()
                .id(1L)
                .store(mockStore)
                .name("아메리카노")
                .price(4500)
                .status(true)
                .image("https://example.com/images/americano.jpg")
                .productType(ProductType.ICE) // 가정: ProductType Enum 값
                .productSize(ProductSize.L) // 가정: ProductSize Enum 값
                .store(Store.builder()
                        .id(1)
                        .name("카페 하루")
                        .build()
                )
                .productCategory(ProductCategory.builder()
                        .id(2)
                        .productCategoryName("커피")
                        .build()
                )
                .build();

        Product product2 = Product.builder()
                .id(2L)
                .store(mockStore)
                .name("카페라떼")
                .price(3500)
                .status(true)
                .image("https://example.com/images/americano.jpg")
                .productType(ProductType.ICE) // 가정: ProductType Enum 값
                .productSize(ProductSize.L) // 가정: ProductSize Enum 값
                .store(Store.builder()
                        .id(1)
                        .name("카페 하루")
                        .build()
                )
                .productCategory(ProductCategory.builder()
                        .id(2)
                        .productCategoryName("커피")
                        .build()
                )
                .build();

        List<Product> mockProductList = Arrays.asList(
               product1, product2
        );

        List<ProductListResponse> mockResponseList = Arrays.asList(
                new ProductListResponse(1L, 2, "아메리카노", 4500, true, "https://example.com/images/americano.jpg"),
                new ProductListResponse(2L, 2,"카페라떼", 3500, true, "https://example.com/images/americano.jpg")
        );


        try (MockedStatic<ProductMapper> mockedStatic = mockStatic(ProductMapper.class)) {
            // Mocking
            when(productRepository.findByStoreId(anyInt())).thenReturn(mockProductList);
            mockedStatic.when(() -> ProductMapper.convertProductListResponse(mockProductList.get(0)))
                    .thenReturn(mockResponseList.get(0));
            mockedStatic.when(() -> ProductMapper.convertProductListResponse(mockProductList.get(1)))
                    .thenReturn(mockResponseList.get(1));

            // When
            List<ProductListResponse> result = productService.getListAllProduct(mockStore.getId());

            // Then
            assertNotNull(result);
            assertEquals(2, result.size());
            assertEquals("아메리카노", result.get(0).getName());
            assertEquals("카페라떼", result.get(1).getName());
            assertEquals(4500, result.get(0).getPrice());
            assertEquals(3500, result.get(1).getPrice());
            assertEquals("https://example.com/images/americano.jpg", result.get(0).getImage());
            assertEquals("https://example.com/images/americano.jpg", result.get(1).getImage());
        }
    }

    @Test
    @DisplayName("매장별 상품 상세 조회 - 정상 케이스")
    void getDetailProduct_Success() {
        // given
        Integer storeId = 1;
        Long productId = 1L;
        Product mockProduct = getMockProduct();

        ProductDetailResponse mockProductDetailResponse = new ProductDetailResponse(1L, 2,
                1, "아메리카노", 4500, true, 1, "https://example.com/images/americano.jpg",
                ProductType.ICE, ProductSize.L);

        try (MockedStatic<ProductMapper> mockedStatic = mockStatic(ProductMapper.class)) {

            when(productRepository.findByIdAndStoreId(productId, storeId)).thenReturn(Optional.ofNullable(mockProduct));
            mockedStatic.when(() -> ProductMapper.convertProductDetailResponse(mockProduct))
                    .thenReturn(mockProductDetailResponse);

            // when
            ProductDetailResponse result = productService.getDetailProduct(storeId, productId);

            // Then
            assertNotNull(result);
            assertEquals("아메리카노", result.getName());
            assertEquals(4500, result.getPrice());
            assertEquals("https://example.com/images/americano.jpg", result.getImage());
            assertEquals(ProductType.ICE, result.getProductType());
            assertEquals(ProductSize.L, result.getProductSize());
        }
    }

    @Test
    @DisplayName("상품 정보 수정 - 정상 케이스")
    void testModifyProduct_success() {
        // given
        Product productEntity = getMockProduct();
        Integer storeId = 1;
        Long productId = 1L;
        ProductUpdateRequest mockProductUpdateRequest = new ProductUpdateRequest();
        mockProductUpdateRequest.setProductType(ProductType.HOT);
        mockProductUpdateRequest.setProductSize(ProductSize.F);
        mockProductUpdateRequest.setPrice(1999);
        mockProductUpdateRequest.setImage("new_image_url");
        mockProductUpdateRequest.setStatus(true);
        mockProductUpdateRequest.setName("카페라떼");
        mockProductUpdateRequest.setProductCategoryId(1);
        // mocking
        when(productRepository.findByIdAndStoreId(productId, storeId)).thenReturn(Optional.ofNullable(productEntity));
        // when
        productService.modifyProduct(storeId, productId, mockProductUpdateRequest);
        // then
        assertNotNull(productEntity);
        verify(productEntity.getProductCategory()).setId(1);
        verify(productEntity).setStatus(true);
        verify(productEntity).setImage("new_image_url");
        verify(productEntity).setName("카페라떼");
        verify(productEntity).setPrice(1999);
        verify(productEntity).setProductType(ProductType.HOT);
        verify(productEntity).setProductSize(ProductSize.F);
    }

    @Test
    @DisplayName("상품 정보 수정 - 정상 케이스")
    void testDeleteProduct_success(){
        //given
        Product productEntity = getMockProduct();
        Integer storeId = 1;
        Long productId = 1L;
        when(productRepository.findByIdAndStoreId(productId, storeId)).thenReturn(Optional.ofNullable(productEntity));

        //when
        productService.deleteProduct(storeId, productId);

        // then
        verify(productRepository, times(1)).deleteByIdAndStoreId(storeId, productId);
    }


    public Product getMockProduct() {
        // UserOwner 객체 설정
        UserOwner mockUserOwner1 = new UserOwner("owner1@example.com", "password1", "김싸피", "1999-01-15", StaffType.OWNER, "fcmToken1");

        // Store 객체 mock 처리
        Store mockStore = mock(Store.class);
        when(mockStore.getId()).thenReturn(1);
        when(mockStore.getName()).thenReturn("테스트 매장");

        // ProductCategory 객체 mock 처리
        ProductCategory mockProductCategory = mock(ProductCategory.class);
        when(mockProductCategory.getId()).thenReturn(2);
        when(mockProductCategory.getProductCategoryName()).thenReturn("커피");

        // Product 객체 mock 처리
        Product mockProduct = mock(Product.class);

        // Product 객체 내부의 메서드들 mock 처리
        when(mockProduct.getId()).thenReturn(1L);
        when(mockProduct.getStore()).thenReturn(mockStore);
        when(mockProduct.getName()).thenReturn("아메리카노");
        when(mockProduct.getPrice()).thenReturn(4500);
        when(mockProduct.isStatus()).thenReturn(true);
        when(mockProduct.getImage()).thenReturn("https://example.com/images/americano.jpg");
        when(mockProduct.getProductType()).thenReturn(ProductType.ICE);
        when(mockProduct.getProductSize()).thenReturn(ProductSize.L);
        when(mockProduct.getProductCategory()).thenReturn(mockProductCategory);

        return mockProduct;
    }



}
