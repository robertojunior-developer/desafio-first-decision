package com.firstdecision.users.service;

public class PasswordMismatchException extends RuntimeException {
    public PasswordMismatchException(String message) { super(message); }
}
