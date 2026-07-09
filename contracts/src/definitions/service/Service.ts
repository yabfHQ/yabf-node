import { Errors } from '../errors'
import { Procedures } from '../procedure'

export interface Service<
    TName extends string,
    TProcedures extends Procedures,
    TErrors extends Errors = []
> {
    name: TName
    procedures: TProcedures
    errors?: TErrors | undefined
}
