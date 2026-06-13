import { Plus } from 'lucide-react'
import { Icon  } from '../Icon'
import type {IconProps} from '../Icon';

export const PlusIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={Plus} {...props} />
)
