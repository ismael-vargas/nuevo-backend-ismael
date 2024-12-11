import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { parse } from 'dotenv';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string }
    constructor() {
        const env = process.env.NODE_ENV || 'development';
        const envFilePath = `${__dirname}/../../../.env.${env}`;
        const existsPath = fs.existsSync(envFilePath);

        if (!existsPath) {
            console.log(`.env.${process.env.NODE_ENV} no existe`);
            process.exit(0);
        }

        this.envConfig = parse(fs.readFileSync(envFilePath));
    }
    get(key: string): string {
        return this.envConfig[key];
    }

    /*
    constructor(){
        const env = process.env.NODE_ENV || 'development'
        const isDevelopmentEnv = process.env.NODE_ENV ! == 'production'
        if(isDevelopmentEnv){
            const envFilePath= __dirname +'/../../.env.development'
            const existsPath = fs.existsSync(envFilePath)
            if(!existsPath){
                console.log('.env.development no existe en DEVELOPMENT')
                process.exit(0)
            }
            this.envConfig=parse(fs.readFileSync(envFilePath))
        }
        else
        {
             const envFilePath= __dirname+'/../../.env.production'
             const existsPath = fs.existsSync(envFilePath)
            if(!existsPath){
                console.log('.env.production no existe en PRODUCTION')
                process.exit(0)
            }
            this.envConfig=parse(fs.readFileSync(envFilePath))
        }
    }*/


}

