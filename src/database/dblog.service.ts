import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import * as path from "path";
import * as fs from "fs";
import { StaffService } from 'src/modules/staff/staff.service';

@Injectable()
export class DbLogService implements OnModuleInit {

    constructor(
        private prisma: DatabaseService,
    ) { }


    async onModuleInit() {

        const filePath = path.join(process.cwd(), 'src', 'sql', 'sqlLog.sql');
        const sql = fs.readFileSync(filePath, 'utf-8');

        try {
            await this.prisma.$executeRawUnsafe(sql);
            console.log('✅ SQL file executed successfully on startup');
        } catch (error) {
            console.error('❌ Error executing SQL file:', error);
        }
    }
}
