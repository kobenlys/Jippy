package com.hbhw.jippy.utils;

public class EnvironmentUtil {
    private static final String ENV = System.getProperty("env", "DEV");

    public static boolean isProduction(){
        return "PROD".equalsIgnoreCase(ENV);
    }
}
