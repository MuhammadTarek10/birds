import { LogOut } from 'lucide-react'
import { Icon  } from '../Icon'
import type {IconProps} from '../Icon';

export const LogOutIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={LogOut} {...props} />
)
