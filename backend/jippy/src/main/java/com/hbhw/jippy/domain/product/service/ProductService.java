package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.request.ProductUpdateRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.ProductCategory;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.ProductRepository;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.service.StoreService;
import com.hbhw.jippy.global.code.CommonErrorCode;
import com.hbhw.jippy.global.error.BusinessException;
import com.hbhw.jippy.utils.UUIDProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreService storeService;
    private final ProductCategoryService productCategoryService;
    private final S3Client s3Client;
    private final UUIDProvider uuidProvider;

    @Value("${cloud.aws.s3.bucket}")
    private String s3BucketName;

    @Value("${cloud.aws.s3.bucket.base.url}")
    private String s3BaseUrl;
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    /**
     * 상품 등록 + S3
     */
    @Transactional
    public void createProduct(CreateProductRequest createProductRequest, MultipartFile image){
        Store storeEntity = storeService.getStoreEntity(createProductRequest.getStoreId());
        ProductCategory productCategoryEntity = productCategoryService
                .getProductCategoryEntity(createProductRequest.getStoreId(), createProductRequest.getProductCategoryId());

        String imageName = uuidProvider.generateUUID() +"-"+image.getOriginalFilename();

        try{

            String imageUrl = "";

            if(!image.isEmpty()){
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(s3BucketName)
                        .key(imageName)
                        .contentType(image.getContentType())
                        .contentLength(image.getSize())
                        .build();

                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(image.getInputStream(), image.getSize()));
                imageUrl = s3Client.utilities().getUrl(builder -> builder.bucket(s3BucketName).key(imageName)).toExternalForm();
            }else{
                imageUrl = s3BaseUrl;
            }

            Product product = Product.builder()
                    .store(storeEntity)
                    .productCategory(productCategoryEntity)
                    .name(createProductRequest.getName())
                    .price(createProductRequest.getPrice())
                    .status(createProductRequest.isStatus())
                    .image(imageUrl)
                    .productType(createProductRequest.getProductType())
                    .productSize(createProductRequest.getProductSize())
                    .build();

            productRepository.save(product);
        }catch (IOException e){
            throw new BusinessException(CommonErrorCode.INTERNAL_SERVER_ERROR, "이미지 업로드를 실패했습니다");
        }catch (Exception e){
            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(s3BucketName).key(imageName).build());
            throw new BusinessException(CommonErrorCode.INTERNAL_SERVER_ERROR, "상품 저장에 실패했습니다.");
        }
    }

    /**
     * 매장별 상품 목록 조회
     */
    public List<ProductListResponse> getListAllProduct(Integer storeId) {
        List<Product> productList = productRepository.findByStoreId(storeId);
        if (productList == null || productList.isEmpty()) {
            throw new NoSuchElementException();
        }

        return productList.stream()
                .map(ProductMapper::convertProductListResponse)
                .toList();
    }

    /**
     * 상품 상세 조회
     */
    public ProductDetailResponse getDetailProduct(Integer storeId, Long productId) {
        Product productEntity = getProduct(storeId, productId);

        return ProductDetailResponse.builder()
                .productId(productEntity.getId())
                .storeId(storeId)
                .name(productEntity.getName())
                .status(productEntity.isStatus())
                .productCategoryId(productEntity.getProductCategory().getId())
                .image(productEntity.getImage())
                .price(productEntity.getPrice())
                .productType(productEntity.getProductType())
                .productSize(productEntity.getProductSize())
                .build();
    }

    /**
     * 매장별 상품 수정
     */
    @Transactional
    public void modifyProduct(Integer storeId, Long productId, ProductUpdateRequest productUpdateRequest) {
        Product productEntity = getProduct(storeId, productId);

        productEntity.getProductCategory().setId(productUpdateRequest.getProductCategoryId());
        productEntity.setStatus(productUpdateRequest.isStatus());
        productEntity.setImage(productUpdateRequest.getImage());
        productEntity.setName(productUpdateRequest.getName());
        productEntity.setPrice(productUpdateRequest.getPrice());
        productEntity.setProductType(productUpdateRequest.getProductType());
        productEntity.setProductSize(productUpdateRequest.getProductSize());
    }

    /**
     * 매장 상품 삭제
     */
    public void deleteProduct(Integer storeId, Long productId) {
        Product productEntity = getProduct(storeId, productId);
        productRepository.deleteByIdAndStoreId(storeId, productId);
    }

    /**
     * 매장번호, 상품번호로 상품 조회하기
     */
    @Transactional(readOnly = true)
    public Product getProduct(Integer storeId, Long productId) {
        Optional<Product> product = productRepository.findByIdAndStoreId(productId, storeId);
        return product.orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "상품이 존재하지 않습니다."));
    }
}
