import { Heart } from 'lucide-react'
import { Icon  } from '../Icon'
import type {IconProps} from '../Icon';

export const HeartIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Heart} {...props} />
)
