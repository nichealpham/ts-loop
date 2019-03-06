import { Storage as GoogleStorage } from '@google-cloud/storage';

export class Storage {
    public storage: GoogleStorage;
    public bucketName: string;
    public subDirPath: string;

    constructor(jsonKeyPath: string, subDirPath: string = '') {
        let specConfig = require(jsonKeyPath) || {};
        let projectId = specConfig.projectId;
        this.bucketName = projectId + '.appspot.com';
        this.subDirPath = subDirPath || 'gstorage';
        this.storage = new GoogleStorage({ projectId, keyFilename: jsonKeyPath });
    }

    getSubDirUri(): string {
        return `https://storage.googleapis.com/${this.bucketName}/${this.subDirPath}`;
    }

    getGsuitUri(): string {
        return `gs://${this.bucketName}/${this.subDirPath}`;
    }

    async exist(filePath): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`).exists().then(data => resolve(data[0]));
        });
    }

    async uploadBuffer(filePath: string, buffer: Buffer, makePublic: boolean = false, cacheControl: string = 'no-cache, no-store, max-age=0', prefix = '', mimetype: string = ''): Promise<string> {
        filePath = prefix ? prefix + '/' + filePath : filePath;
        return new Promise<string>(async (resolve, reject) => {
            if (await this.exist(filePath))
                await this.deleteFile(filePath);

            let file = this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`);
            let option: any = {
                metadata: {
                    cacheControl
                }
            }
            if (mimetype)
                option.metadata.contentType = mimetype;
            let writeStream = file.createWriteStream(option);

            writeStream.on('error', (err) => {
                reject(err);
            });
            writeStream.on('finish', async () => {
                if (makePublic)
                    await this.makePublic(filePath);
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.subDirPath}/${filePath}`);
            });
            writeStream.end(buffer);
        });
    }

    async uploadFile(filePath: string, makePublic: boolean = false, cacheControl: string = 'no-cache, no-store, max-age=0', prefix = ''): Promise<string> {
        let destPath = prefix ? prefix + '/' + filePath : filePath;
        return new Promise<string>(async (resolve, reject) => {
            if (await this.exist(destPath))
                await this.deleteFile(destPath);
            this.storage.bucket(this.bucketName).upload(filePath, {
                gzip: false,
                metadata: {
                    cacheControl,
                },
            }).then(async () => {
                let fileName = filePath.substr(filePath.lastIndexOf('/') + 1, filePath.length);
                await this.moveUploadedFile(fileName, destPath);
                if (makePublic)
                    await this.makePublic(destPath);
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.subDirPath}/${destPath}`);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async uploadFile2Folder(filePath: string, makePublic: boolean = false, cacheControl: string = 'no-cache, no-store, max-age=0', prefix = ''): Promise<string> {
        let splited = splitPathAndFileName(filePath);
        let fileName = splited.file;
        let destPath = prefix ? `${prefix}/${fileName}` : fileName;
        return new Promise<string>(async (resolve, reject) => {
            if (await this.exist(destPath))
                await this.deleteFile(destPath);
            this.storage.bucket(this.bucketName).upload(filePath, {
                gzip: false,
                metadata: {
                    cacheControl,
                },
            }).then(async () => {
                await this.moveUploadedFile(fileName, destPath);
                if (makePublic)
                    await this.makePublic(destPath);
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.subDirPath}/${destPath}`);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async getDownloadUrl(filePath: string, prefix = ''): Promise<string> {
        let destPath = prefix ? prefix + '/' + filePath : filePath;
        let file = this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${destPath}`);
        return new Promise<string>((resolve) => {
            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            }).then(signedUrls => {
                return resolve(signedUrls[0]);
            });
        });
    }

    async downloadFile(filePath: string, localPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let options = {
                destination: localPath,
            };
            this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`).download(options).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async deleteFile(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`).delete().then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }

    async getMetaData(filePath: string): Promise<{
        name, bucket, storageClass, id, size,
        cacheControl, contentType, contentEncoding,
        mediaLink, metadata
    }> {
        return new Promise<any>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`).getMetadata().then((results) => {
                resolve(results[0]);
            }).catch(err => {
                reject(err);
            });
        })
    }

    async makePublic(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`).makePublic().then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async moveFile(filePath: string, fileDestPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`).move(`${this.subDirPath}/${fileDestPath}`).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async moveUploadedFile(filename: string, fileDestPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(filename).move(`${this.subDirPath}/${fileDestPath}`).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async copyFile(filePath: string, fileDestPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${filePath}`).copy(
                this.storage.bucket(this.bucketName).file(`${this.subDirPath}/${fileDestPath}`)
            ).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async listFiles(prefix: string, delimiter?: string): Promise<{ name }[]> {
        let options: { prefix, delimiter?} = {
            prefix: prefix
        };
        if (delimiter) {
            options.delimiter = delimiter;
        };

        return new Promise<{ name }[]>((resolve, reject) => {
            this.storage.bucket(this.bucketName).getFiles(options).then(result => {
                let files = result[0];
                resolve(files.map(file => {
                    return {
                        name: file.name
                    }
                }));
            }).catch(err => reject(err));
        });
    }

    protected createBucket(bucketName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.createBucket(bucketName).then(() => { resolve(true) })
                .catch(err => { reject(err) });
        });
    }

    protected listBucketNames(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.storage.getBuckets().then(result => {
                let buckets = result[0];
                resolve(buckets.map(bucket => bucket.name));
            }).catch(err => reject(err));
        });
    }
}

function splitPathAndFileName(fullPath: string): { file: string, path: string } {
    return {
        file: fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length),
        path: fullPath.slice(0, fullPath.lastIndexOf('/'))
    }
}