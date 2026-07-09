import { AnyError } from '../errors'
import { Message } from './message'

export interface Procedure<TInput, TOutput, TErrors extends AnyError[] = []> {
    input: Message<TInput>
    output: Message<TOutput>
    errors?: TErrors | undefined
}
