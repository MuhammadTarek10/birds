import { User } from 'lucide-react'
import { Icon  } from '../Icon'
import type {IconProps} from '../Icon';

export const UserIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={User} {...props} />
)
