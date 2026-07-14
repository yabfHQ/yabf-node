import { CallContext as BaseContext, createContext as createBaseContext } from '@yabf/call'
import { Call } from './Call'

export interface CallContext extends BaseContext<Call> {}

export function createContext(context: Omit<CallContext, 'timeout'>): CallContext {
    return createBaseContext(context)
}
