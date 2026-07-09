import { RPCError } from '../../definitions'
import { ErrorWithoutCode } from './ErrorWithoutCode'

export function error<const TCode extends string, TDetails>(
    code: TCode,
    error: ErrorWithoutCode<TDetails>
): RPCError<TCode, TDetails> {
    return {
        status: error.status,
        code,
        retriable: error.retriable,
        details: error.details
    }
}
