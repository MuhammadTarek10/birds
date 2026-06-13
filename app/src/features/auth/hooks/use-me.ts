import { useQuery } from '@tanstack/react-query'
import { meQuery } from '../queries'

export const useMe = () => useQuery(meQuery)
