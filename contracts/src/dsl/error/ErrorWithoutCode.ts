import { Status } from '@yabf/common'
import { ZodType } from 'zod'

export interface ErrorWithoutCode<TDetails = any> {
    status: Status
    retriable?: boolean | undefined
    details: ZodType<TDetails>
}
