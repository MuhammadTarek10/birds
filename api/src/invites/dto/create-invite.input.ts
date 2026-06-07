export class CreateInviteInput {
  podId!: string;
  createdBy!: string;
  email?: string;
  expiresInHours?: number;
}
