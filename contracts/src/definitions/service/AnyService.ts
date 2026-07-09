import { Errors } from '../errors'
import { Procedures } from '../procedure'
import { Service } from './Service'

export interface AnyService extends Service<string, Procedures, Errors> {}
