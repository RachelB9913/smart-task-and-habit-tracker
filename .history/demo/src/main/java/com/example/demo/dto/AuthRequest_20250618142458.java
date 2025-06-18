// AuthRequest.java
package com.example.demo.dto;

public class AuthRequest {
    private String identifier; //username or email
    private String password;
    

    // Getters and setters
    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
