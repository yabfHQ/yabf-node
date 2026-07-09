import { RPCError } from './RPCError'

export interface AnyError extends RPCError<string, any> {}
