import * as fs from 'fs';
import * as RequestPromise from 'request-promise';

export class Request {
    static async get(url: string, timeout: number = 600000, headers?: any): Promise<any> {
        return new Promise<any>((resolve) => {
            let options: any = {
                timeout,
                method: 'GET',
                uri: url,
                json: true,
            };
            if (headers)
                options.headers = headers;
            RequestPromise(options).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error.toString());
                resolve(null);
            });
        });
    }

    static async postFile(uri: string, filePath: string, uploadKey: string, jsonData = {}, timeout: number = 600000, headers?: any): Promise<any> {
        return new Promise<any>((resolve) => {
            let options: any = {
                uri,
                timeout,
                method: 'POST',
                json: true,
                formData: jsonData || {},
            };
            options.formData[uploadKey] = fs.createReadStream(filePath);
            if (headers)
                options.headers = headers;
            RequestPromise(options).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error.toString());
                resolve(null);
            });
        });
    }

    static async post(uri: string, data: any = {}, timeout: number = 600000, headers?: any): Promise<any> {
        return new Promise<any>((resolve) => {
            let options: any = {
                uri,
                timeout,
                method: 'POST',
                json: true,
                body: data || {},
            };
            if (headers)
                options.headers = headers;
            RequestPromise(options).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error.toString());
                resolve(null);
            });
        });
    }

    static async put(url: string, data?: any, timeout: number = 600000, headers?: any): Promise<any> {
        return new Promise<any>((resolve) => {
            let options: any = {
                timeout,
                method: 'PUT',
                uri: url,
            };
            if (data) {
                options.body = data;
                options.json = true;
            };
            if (headers)
                options.headers = headers;
            RequestPromise(options).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error.toString());
                resolve(null);
            });
        });
    }

    static async delete(url: string, timeout: number = 600000, headers?: any): Promise<any> {
        return new Promise<any>((resolve) => {
            let options: any = {
                timeout,
                method: 'DELETE',
                uri: url,
                json: true,
            };
            if (headers)
                options.headers = headers;
            RequestPromise(options).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error.toString());
                resolve(null);
            });
        });
    }
}