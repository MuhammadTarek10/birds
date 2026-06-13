import { ChevronRight } from 'lucide-react'
import { Icon  } from '../Icon'
import type {IconProps} from '../Icon';

export const ChevronRightIcon = (props: Omit<IconProps, 'icon'>) => (
  <Icon icon={ChevronRight} {...props} />
)
