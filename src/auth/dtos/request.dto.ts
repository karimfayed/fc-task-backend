import { Request } from 'express';
import { Roles } from 'src/common/enums/roles.enum';

export interface RequestDto extends Request {
  userId: string;
  role: Roles;
}
