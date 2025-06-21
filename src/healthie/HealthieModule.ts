import { Module } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HealthieService } from './service/HealthieService';
import { HealthieChatService } from './service/HealthieChatService';
import { HEALTHIE_API_CLIENT } from './const/injection-tokens';

const HEALTHIE_GRAPHQL_URL = 'https://api.gethealthie.com/graphql';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: HEALTHIE_API_CLIENT,
      useFactory: (): AxiosInstance => {
        return axios.create({
          baseURL: HEALTHIE_GRAPHQL_URL,
          headers: {
            Authorization: `Basic ${process.env.HEALTHIE_API_KEY}`,
            AuthorizationSource: 'API',
            'Content-Type': 'application/json',
          },
        });
      },
    },
    HealthieService,
    HealthieChatService,
  ],
  exports: [HealthieService, HealthieChatService, HEALTHIE_API_CLIENT],
})
export class HealthieModule {}
