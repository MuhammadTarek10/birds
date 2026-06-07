import { ApiProperty } from '@nestjs/swagger';
import { PodMemberResponse } from './pod-member.response';

export class PodMembersResponse {
  @ApiProperty({ type: [PodMemberResponse] })
  members!: PodMemberResponse[];
}
