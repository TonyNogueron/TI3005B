-- Initialize the database
CREATE DATABASE IF NOT EXISTS Hilados;

USE Hilados;

-- Vendors Table
CREATE TABLE
    IF NOT EXISTS Vendor (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL,
        isActive BOOLEAN DEFAULT TRUE
    );

-- Clients Table
CREATE TABLE
    IF NOT EXISTS Client (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        vendorId INT NOT NULL,
        email VARCHAR(100) NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL,
        documentsStatus ENUM (
            'Sin entrega',
            'Por validar',
            'Incorrecto',
            'Aceptado'
        ) NOT NULL DEFAULT 'Sin entrega',
        isActive BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (vendorId) REFERENCES Vendor (id)
    );

-- Providers Table
CREATE TABLE
    IF NOT EXISTS Provider (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        vendorId INT NOT NULL,
        email VARCHAR(100) NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL,
        documentsStatus ENUM (
            'Sin entrega',
            'Por validar',
            'Incorrecto',
            'Aceptado'
        ) NOT NULL DEFAULT 'Sin entrega',
        isActive BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (vendorId) REFERENCES Vendor (id)
    );

-- Users Table (For tracking document uploads)
CREATE TABLE
    IF NOT EXISTS User (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

-- Documents Table
CREATE TABLE
    IF NOT EXISTS Document (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ownerType ENUM ('Client', 'Provider') NOT NULL,
        ownerId INT NOT NULL,
        documentType ENUM (
            'ConstanciaDeSituacionFiscal',
            'OpinionDeCumplimiento',
            'Contrato',
            'OrdenDeCompra'
        ) NOT NULL,
        fileName VARCHAR(255),
        fileType VARCHAR(50),
        fileUrl TEXT NULL,
        uploadTimestamp TIMESTAMP NULL DEFAULT NULL,
        requestedTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        validStatus ENUM ('Por validar', 'Aceptado', 'Rechazado') NOT NULL DEFAULT 'Por validar',
        rejectedReason TEXT NULL,
        uploadedBy INT NULL,
        FOREIGN KEY (uploadedBy) REFERENCES User (id)
    );

-- Insert dummy data
INSERT INTO
    Vendor (name, email, phoneNumber)
VALUES
    (
        'Manuel Zavala',
        'manuel_zavala@hiladosdealtacalidad.com',
        '7773068011'
    );

INSERT INTO
    Client (
        name,
        vendorId,
        email,
        phoneNumber,
        documentsStatus
    )
VALUES
    (
        'Tec CVA',
        1,
        'tec@hiladosdealtacalidad.com',
        '7774664704',
        'Por validar'
    ),
    (
        'Hilos Diseño',
        1,
        'administracion_hilos_diseno@gmail.com',
        '7771983876',
        'Por validar'
    );

INSERT INTO
    Provider (
        name,
        vendorId,
        email,
        phoneNumber,
        documentsStatus
    )
VALUES
    (
        'ARGO ALMACENADORA',
        1,
        'argo_almacenadora@example.com',
        '7778889999',
        'Aceptado'
    );

INSERT INTO
    User (name, email, password)
VALUES
    (
        'Admin',
        'admin@hiladosdealtacalidad.com',
        'Numero12345$.'
    );

INSERT INTO
    Document (
        ownerType,
        ownerId,
        documentType,
        fileName,
        fileType,
        fileUrl,
        validStatus,
        uploadedBy,
        uploadTimestamp
    )
VALUES
    (
        'Provider',
        1,
        'ConstanciaDeSituacionFiscal',
        'constancia.pdf',
        'PDF',
        'https://www.orimi.com/pdf-test.pdf',
        'Aceptado',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'Provider',
        1,
        'OpinionDeCumplimiento',
        'opinion.pdf',
        'PDF',
        'https://www.orimi.com/pdf-test.pdf',
        'Aceptado',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        'Provider',
        1,
        'Contrato',
        'contrato.pdf',
        'PDF',
        'https://www.orimi.com/pdf-test.pdf',
        'Aceptado',
        1,
        CURRENT_TIMESTAMP
    );