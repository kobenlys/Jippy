package com.hbhw.jippy;

import com.hbhw.jippy.domain.product.repository.RecipeCustomRepository;
import com.hbhw.jippy.domain.product.repository.RecipeRepository;
import com.hbhw.jippy.domain.product.service.ProductService;
import com.hbhw.jippy.domain.product.service.RecipeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

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
    void createRecipe_success(){


    }




}
