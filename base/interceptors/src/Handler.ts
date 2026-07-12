import { BaseCallContext } from '@yabf/context-base'
import { Messages } from '@yabf/messages'

export interface Handler<T extends BaseCallContext> {
    (context: T, messages: Messages<any>): Messages<any> | Promise<Messages<any>>
}
