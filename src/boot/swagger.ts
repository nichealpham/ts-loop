let swaggerUi = require('swagger-ui-express');
let loopbackSwagger = require('loopback-swagger');
let generateSwaggerSpec = loopbackSwagger.generateSwaggerSpec;

export default (app: any) => {
    let options = {
        resourcePath: 'swagger.json',
        apiInfo: app.get('apiInfo') || {},
        swaggerUI: true,
    }
    let swaggerSpec = generateSwaggerSpec(app, options);
    
    swaggerSpec.info.title = `Payment Service APIs`;
    swaggerSpec.definitions = {};
    
    let router = app.loopback.Router();
    router.get(`/explorer/swagger.json`, async (req, res) => {
        res.status(200).json(swaggerSpec);
    });
    router.use(`/explorer`, swaggerUi.serve);
    router.get(`/explorer`, (req, res) => {
        res.send(swaggerUi.generateHTML(swaggerSpec));
    });
    app.use(router);
}