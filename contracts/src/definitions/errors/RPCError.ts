import { Status } from '@yabf/common'
import { ZodType } from 'zod'

export interface RPCError<TCode extends string, TDetails = any> {
    status: Status
    code: TCode
    retriable?: boolean | undefined
    details: ZodType<TDetails>
}
