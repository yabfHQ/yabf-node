import { Status } from '@yabf/common'
import { z } from 'zod'
import { Errors, Procedures, Service } from '../../definitions'
import { error } from '../error'
import { message, procedure } from '../procedure'
import { UnnamedService } from './UnnamedService'

export function service<
    const TName extends string,
    const TProcedures extends Procedures,
    const Terrors extends Errors = []
>(
    name: TName,
    service: UnnamedService<TProcedures, Terrors>
): Service<TName, TProcedures, Terrors> {
    return {
        name,
        procedures: service.procedures,
        errors: service.errors
    }
}

interface User {
    name: string
}

const s = service('users', {
    procedures: {
        get: procedure({
            input: message(z.string()),
            output: message<User>(
                z.object({
                    name: z.string()
                })
            ),
            errors: [
                error('USER_NOT_FOUND', {
                    status: Status.NOT_FOUND,
                    retriable: true,
                    details: z.object({
                        id: z.string()
                    })
                })
            ]
        })
    }
})
