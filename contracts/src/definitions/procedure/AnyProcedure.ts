import { Errors } from '../errors'
import { Procedure } from './Procedure'

export interface AnyProcedure extends Procedure<any, any, Errors> {}
