import * as loopback from 'loopback';
import * as boot from 'loopback-boot';
let app = loopback();

app.start = function () {
    return app.listen(() => {
        app.emit('app started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        console.log(`Brow APIs at ${baseUrl}/explorer`);
    });
};

boot(app, __dirname, function (err) {
    if (err) throw err;
    if (require.main === module) {
        // return loopbackSSL.startServer(app);
        return app.start()
    }
});

export default app;
