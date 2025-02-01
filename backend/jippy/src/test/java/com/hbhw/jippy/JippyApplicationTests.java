package com.hbhw.jippy;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import javax.sql.DataSource;

@SpringBootTest
class JippyApplicationTests {

	@MockitoBean
	private DataSource dataSource; // 데이터베이스 Bean을 Mock 처리하여 실행 방지

	@Test
	void contextLoads() {
	}
}
