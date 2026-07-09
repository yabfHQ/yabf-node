import { Errors, Procedures } from '../../definitions'

export interface UnnamedService<T extends Procedures, TErrors extends Errors = Errors> {
    procedures: T
    errors?: TErrors
}
