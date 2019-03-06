import * as crypto from 'crypto';
import * as https from 'https';
import * as http from 'http';
import * as zlib from 'zlib';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { Terminal } from './terminal';
let errorList = require('../define/errors/error.en.json');

export class CommonFunctions {
    static mergeWithoutExtend(object1, object2) {
        let result = JSON.parse(JSON.stringify(object1));
        if (!object2)
            return result;
        for (let key in object1) {
            result[key] = object2[key] || object1[key];
        }
        return result;
    }

    static getRandomBytes(bytesLength: number = 8, encryption: string = 'hex'): string {
        return crypto.randomBytes(bytesLength).toString(encryption);
    }

    static padNum2Str(number: number, pad = 10): string {
        let result = number.toString();
        while (result.length < pad) { result = '0' + result };
        return result;
    }

    static async sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        });
    }

    static splitPathAndFileName(fullPath: string): { file: string, path: string } {
        return {
            file: fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length),
            path: fullPath.slice(0, fullPath.lastIndexOf('/'))
        }
    }

    static shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    static convert2HumanFileSize(size: number, decimal: number = 0): string {
        let i: number = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        let value = (size / Math.pow(1024, i)).toFixed(decimal);
        return value + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    static shuffleDataset(features: any[], labels: any[]) {
        let counter = features.length;
        let temp = 0;
        let index = 0;
        while (counter > 0) {
            index = (Math.random() * counter) | 0;
            counter--;
            // Shuffle features:
            temp = features[counter];
            features[counter] = features[index];
            features[index] = temp;
            // Shuffle labels:
            temp = labels[counter];
            labels[counter] = labels[index];
            labels[index] = temp;
        }
        return { features, labels };
    }

    static normalizeDataset(features: number[][], labels: number[]) {
        let maxLabel = 0;
        labels.forEach(label => {
            if (label > maxLabel) maxLabel = label;
        });
        labels = labels.map(label => label / maxLabel);
        for (let i = 0; i < features[0].length; i++) {
            let maxColumn = 0;
            features.forEach(featureRow => {
                if (featureRow[i] > maxColumn) maxColumn = featureRow[i];
            });
            for (let j = 0; j < features.length; j++) {
                features[j][i] = features[j][i] / maxColumn;
            }
        };
        return { features, labels };
    }

    static readBufferFromUri(uri: string, bytesLength?: number, bytesOffset = 0): Promise<Buffer | null> {
        return new Promise<Buffer | null>((resolve) => {
            let req: any = null;
            let callback = (res) => {
                let chunks: Buffer[] = [];
                let chunkSize: number = 0;
                let nextStage = res;
                if (uri.includes('.gz')) {
                    let unzip = zlib.createGunzip();
                    res.pipe(unzip);
                    nextStage = unzip;
                };
                nextStage.on('data', (buffer) => {
                    chunks.push(buffer);
                    chunkSize += buffer.byteLength;
                    if (bytesLength && chunkSize > (bytesOffset + bytesLength)) {
                        req.abort();
                        buffer = Buffer.concat(chunks);
                        return resolve(buffer.slice(bytesOffset, bytesOffset + bytesLength));
                    }
                }).on('end', () => {
                    let buffer = Buffer.concat(chunks);
                    return resolve(buffer.slice(bytesOffset));
                }).on('error', () => {
                    return resolve(null);
                });
            };
            console.log(`\n Reading file from ${uri} ...`);
            if (uri.includes('https')) req = https.get(uri, res => callback(res));
            else req = http.get(uri, res => callback(res));
        });
    }

    static addSeconds(date: Date, seconds: number): Date {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }

    static addMinutes(date: Date, minutes: number): Date {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }

    static addHours(date: Date, hours: number): Date {
        date.setHours(date.getHours() + hours);
        return date;
    }

    static addDays(date: Date, days: number): Date {
        date.setDate(date.getDate() + days);
        return date;
    }

    static addMonths(date: Date, months: number): Date {
        date.setMonth(date.getMonth() + months);
        return date;
    }

    static addYears(date: Date, years: number): Date {
        date.setFullYear(date.getFullYear() + years);
        return date;
    }

    static dirExist(path: string): Boolean {
        let result: boolean = false;
        try {
            result = fs.existsSync(path);
        }
        catch (err) {
            return false;
        }
        return result;
    }

    static isDirectory(path: string): Boolean {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    }

    static createDir(path: string): Boolean {
        if (!fs.existsSync(path)) {
            try { fs.mkdirSync(path) }
            catch (err) { return false }
        }
        return true;
    }

    static async mkDirByFullPath(targetDir: string) {
        let cmd = `mkdir -p ${targetDir}`;
        return await Terminal.execute(cmd);
    }

    static async removeDir(path): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            if (fs.existsSync(path)) {
                try { rimraf(path, () => { return resolve(true) }) }
                catch (error) { return reject(error) }
            };
            return resolve(true);
        })
    }

    static async writeBuffer(fullPath: string, data: Buffer): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.writeFile(fullPath, data, (err) => {
                if (err)
                    return reject(err);
                return resolve(true);
            });
        })
    }

    static async readBuffer(fullPath: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(fullPath, (err, data) => {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        })
    }

    static systemError = (code: string): Error => {
        let error_object = errorList[code];
        let error: any = new Error(error_object.message);
        error.statusCode = error_object.statusCode;
        error.code = code;
        return error;
    }

    static filterHasMany = (loopbackModel: any) => {
        let relations = [];
        for (let key in loopbackModel.settings.relations || {}) {
            if (loopbackModel.settings.relations[key].type === 'hasMany') {
                relations.push(key);
            }
        }
        return relations;
    }

    static compareObjects = (obj1: Object, obj2: Object, keys = []) => {
        if (!keys || !keys.length) {
            let keys1 = Object.keys(obj1).filter(key => typeof obj1[key] !== 'function');
            let keys2 = Object.keys(obj2).filter(key => typeof obj2[key] !== 'function');
            keys = [...keys1, ...keys2];
        }
        let diff = {};
        keys.forEach(key => {
            if (obj1[key] !== obj2[key]) {
                diff[key] = {
                    obj1: obj1[key],
                    obj2: obj2[key],
                }
            }
        });
        return diff;
    }

    static convertNullToNotFoundError = (ctx: any, callback: any) => {
        if (ctx.result !== null) return callback();
        var modelName = ctx.method.sharedClass.name;
        var _id = ctx.getArgByName('_id');
        var msg = `Unknown ${modelName} ${_id}`;
        var error: any = new Error(msg);
        error.statusCode = error.status = 404;
        error.code = 'MODEL_NOT_FOUND';
        return callback(error);
    }
    
    static setRemoting = (scope: any, name: any, options: any) => {
        var fn = scope[name];
        if (fn) {
            fn._delegate = true;
        }
        options.isStatic = true;
        scope.remoteMethod(name, options);
    }
    
    static accessSearch = (model: any, ctx: any, next: any) => {
        let search = '';
        if(ctx && ctx.query && ctx.query.where && ctx.query.where.search){
            search = ctx.query.where.search.trim();
            delete ctx.query.where.search;
        }
        if(search  && search !== ''){
            let ids = [];
            let mongodb = model.getDataSource().connector.collection(model.modelName);
            mongodb.find({
                $text: {$search: search.toString()}
            }).toArray(function (err, resp) {
                console.log('Find: ',search.toString())
                resp.map(function (value, key) {
                    ids.push(value['_id']);
                });
                console.log('ids', ids);
                ctx.query.where._id = {
                    inq: ids
                };
                next();
            });
        } else{
            next();
        }
    }
}