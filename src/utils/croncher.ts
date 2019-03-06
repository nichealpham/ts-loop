var appRoot = require('app-root-path');
var Schedules = require(appRoot + '/server/schedule.json');
var CronJob = require('cron').CronJob;

import {Axios} from '../utils/axios';

export class Croncher {
    static getSchedules() {
        return JSON.parse(JSON.stringify(Schedules));
    }

    static async loginCroncher() {
        let credentials = {
            email: 'croncher@o2f.vn',
            password: '123456'
        };
        let query = {};
        let headers = {};
        let url = `${process.env.NODE_ENV === 'Local' ? 'http://localhost:4002/' : 'https://api.bravo-hr.ml/'}api/profile/login`;
        let response = await Axios.post(url, query, headers, credentials);
        if (!response || !response.data || response.message) {
            return null
        }
        return response.data && response.data.token;
    }

    static async register(operationId: string) {
        let options = Schedules[operationId];
        let hour = options.hour || '00';
        let minute = options.minute || '00';
        let second = options.second || '00';
        let days = options.days || [1, 7]
        let timeZone = options.timeZone || 'Asia/Ho_Chi_Minh';
        let timeCode = `${second} ${minute} ${hour} * * ${days.join('-')}`;
        let url = `${process.env.NODE_ENV === 'Local' ? 'http://localhost:4002/' : 'https://api.bravo-hr.ml/'}api${options.api_url}`;
        let method = options.method;

        let cron = new CronJob(timeCode, async () => {
            let token = await this.loginCroncher();
            if (!token) {
                return;
            }
            let headers = {
                "authorization": token
            };
            let query = {};
            await Axios[method](url, query, headers, {});
        }, null, null, timeZone);

        cron.start();
        console.log(`Crontab ${operationId} is registered at startup!`);
        return {
            api: operationId,
            registered: true
        }
    }
}