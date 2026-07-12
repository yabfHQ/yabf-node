import { CallContext } from '@yabf/context'
import { Messages } from '@yabf/messages'

export interface Handler<T extends CallContext> {
    (context: T, messages: Messages<any>): Messages<any> | Promise<Messages<any>>
}
