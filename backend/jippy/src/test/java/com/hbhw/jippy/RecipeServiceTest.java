package com.hbhw.jippy;

import com.hbhw.jippy.domain.product.entity.Ingredient;
import com.hbhw.jippy.domain.product.entity.Recipe;
import com.hbhw.jippy.domain.product.repository.RecipeCustomRepository;
import com.hbhw.jippy.domain.product.repository.RecipeRepository;
import com.hbhw.jippy.domain.product.service.ProductService;
import com.hbhw.jippy.domain.product.service.RecipeService;
import com.hbhw.jippy.domain.store.entity.Store;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@MockitoSettings(strictness = Strictness.LENIENT)
@ExtendWith(MockitoExtension.class)
public class RecipeServiceTest {

    @InjectMocks
    private RecipeService recipeService;
    @Mock
    private RecipeRepository recipeRepository;
    @Mock
    private RecipeCustomRepository recipeCustomRepository;
    @Mock
    private ProductService productService;

    @Test
    void createRecipeTest_Success(){
        Recipe mockRecipe = getMockRecipe();

        when()


    }


    public Recipe getMockRecipe(){
        Ingredient mockIngredient1 = mock(Ingredient.class);
        when(mockIngredient1.getName()).thenReturn("원두");
        when(mockIngredient1.getAmount()).thenReturn(10);
        when(mockIngredient1.getUnit()).thenReturn("g");

        Ingredient mockIngredient2 = mock(Ingredient.class);
        when(mockIngredient2.getName()).thenReturn("바닐라시럽");
        when(mockIngredient2.getAmount()).thenReturn(20);
        when(mockIngredient2.getUnit()).thenReturn("mL");

        // mock Ingredient 리스트 생성
        List<Ingredient> mockIngredientList = Arrays.asList(mockIngredient1, mockIngredient2);

        Recipe mockRecipe = mock(Recipe.class);
        when(mockRecipe.getProductId()).thenReturn(1L);
        when(mockRecipe.getUpdatedAt()).thenReturn("2024-01-15 11:11:11");
        when(mockRecipe.getIngredient()).thenReturn(mockIngredientList);

        return mockRecipe;
    }

}
