import dotenv from 'dotenv';
dotenv.config()

type IEnv = {
    APP_PORT: string | number;
    DB_URL: string;
}

const envConfig: IEnv = {
    APP_PORT: process.env.PORT || 8000,
    DB_URL: process.env.DB_URL || ''
}

export default envConfig