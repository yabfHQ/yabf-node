import { ServiceError, Status } from '@yabf/common'

export class UnknownProcedureError extends ServiceError<{
    service: string
    procedure: string
}> {
    constructor(
        public readonly service: string,
        public readonly procedure: string
    ) {
        super(Status.NOT_FOUND, {
            code: 'NOT_FOUND',
            message: `Procedure ${service}.${procedure} does not exist`,
            details: {
                service,
                procedure
            }
        })
    }
}
