module.exports = {
    appPort: 3000,
    mongoUri: 'mongodb://localhost:27017/online-store',
    jwt: {
        jwtSecret: 'jwtSecret',
        tokens:{
            access: {
                type: 'access',
                expiresIn: '2m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '10m',
            },
        }
    }
}