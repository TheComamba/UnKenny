import fs from 'fs';
import dotenv from 'dotenv';
import './__mocks__/main.js';

if (fs.existsSync('.env')) {
    dotenv.config({ override: true });
}
