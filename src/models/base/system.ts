import { path as appRoot } from 'app-root-path';

let serverPath = `${appRoot}/${process.env.NODE_ENV === 'dev' ? 'src' : 'dest'}`;
let schedules = require(serverPath + '/define/schedule.json');

export default (System: any) => {
    System.getSchedules = async () => {
        return schedules;
    }

    System.getPaths = async (): Promise<{serverPath: string, gcpPath: string}> => {
        return { 
            serverPath: serverPath,
            gcpPath: `${serverPath}/gcp-key.json`,
        }
    }
}