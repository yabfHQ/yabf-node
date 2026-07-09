import { AnyProcedure } from '../../definitions'

export function procedure<const T extends AnyProcedure>(procedure: T): T {
    return procedure
}
