import { Settings } from 'lucide-react'
import { Icon  } from '../Icon'
import type {IconProps} from '../Icon';

export const SettingsIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Settings} {...props} />
)
