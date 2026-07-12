import { CallContext } from '@yabf/context'
import { Messages } from '@yabf/messages'

export interface Handler {
    (context: CallContext, messages: Messages<any>): Messages<any> | Promise<Messages<any>>
}
