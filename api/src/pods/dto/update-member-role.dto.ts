import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const POD_ROLES = ['admin', 'member'] as const;
export type PodRole = (typeof POD_ROLES)[number];

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: POD_ROLES, example: 'admin' })
  @IsIn([...POD_ROLES])
  role!: PodRole;
}
