module.exports = {
    // Entorno de prueba
    testEnvironment: 'jsdom',
    
    // Archivos de configuración
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    
    // Manejo de módulos
    moduleNameMapper: {
        // Manejo de estilos
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        // Manejo de archivos multimedia
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    
    // Transformaciones
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    
    // Archivos a ignorar
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],
    testPathIgnorePatterns: ['/node_modules/'],
    
    // Cobertura de código
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/index.js',
        '!src/reportWebVitals.js'
    ],
    
    verbose: true
}; 