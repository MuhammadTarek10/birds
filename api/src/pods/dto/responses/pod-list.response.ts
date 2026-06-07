import { ApiProperty } from '@nestjs/swagger';
import { PodSummaryResponse } from './pod-summary.response';

export class PodListResponse {
  @ApiProperty({ type: [PodSummaryResponse] })
  pods!: PodSummaryResponse[];
}
