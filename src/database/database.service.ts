import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  // constructor() {
  //   super({
  //     log: ['query'], // 👈 This enables query logging
  //   });


  //   // this.$on('query' as never, (event: any) => {
  //   //   console.log('------------------------------------');
  //   //   console.log('Query:', event.query);      // SQL Query
  //   //   console.log('Params:', event.params);    // Arguments
  //   //   console.log('Duration:', event.duration + 'ms');
  //   //   console.log('------------------------------------');
  //   // });
  // }


  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.log('Database connection issue', error);
    }
  }

  async onModuleDestroy() {
    try {
      console.log("this.$connect()", await this.$disconnect());
      await this.$disconnect();
    } catch (error) {
      console.log('Database deconnection issue', error);
    }
  }
}
