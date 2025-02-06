package com.hbhw.jippy.domain.product.controller;

import com.hbhw.jippy.domain.product.dto.request.CreateSetMenuRequest;
import com.hbhw.jippy.domain.product.dto.request.RecipeRequest;
import com.hbhw.jippy.domain.product.dto.request.SearchRecipeRequest;
import com.hbhw.jippy.domain.product.entity.Ingredient;
import com.hbhw.jippy.domain.product.service.SetMenuService;
import com.hbhw.jippy.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/set-menu")
public class SetMenuController {

    private final SetMenuService setMenuService;

    @Operation(summary = "", description = "")
    @PostMapping("/create")
    public ApiResponse<?> createRecipe(@RequestBody CreateSetMenuRequest createSetMenuRequest) {
        setMenuService.createSetMenu(createSetMenuRequest);
        return ApiResponse.success(HttpStatus.CREATED);
    }

    @Operation(summary = "", description = "")
    @DeleteMapping("/delete")
    public ApiResponse<?> deleteRecipe(@RequestBody SearchRecipeRequest searchRecipeRequest) {
        return ApiResponse.success(HttpStatus.OK);
    }

    @Operation(summary = "", description = "")
    @GetMapping("/update")
    public ApiResponse<?> updateRecipe(@RequestBody RecipeRequest recipeRequest) {
        return ApiResponse.success(HttpStatus.OK);
    }

    @Operation(summary = "", description = "")
    @GetMapping("/list/ingredient")
    public ApiResponse<List<Ingredient>> getListIngredient(@RequestParam("storeId") Integer storeId, @RequestParam("productId") Long productId) {
        return ApiResponse.success(HttpStatus.OK, ingredientList);
    }


}
