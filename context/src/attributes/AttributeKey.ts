export interface AttributeKeyWithoutDefault<T> {
    name: string
    defaultValue?: T
}

export interface AttributeKeyWithDefault<T> extends AttributeKeyWithoutDefault<T> {
    defaultValue: T
}

export type AttributeKey<T> = AttributeKeyWithoutDefault<T> | AttributeKeyWithDefault<T>

export function attributeKey<T>(name: string): AttributeKey<T>
export function attributeKey<T>(name: string, defaultValue: T): AttributeKeyWithDefault<T>
export function attributeKey<T>(...args: [name: string, defaultValue?: T]) {
    return args.length === 1 ? { name: args[0] } : { name: args[0], defaultValue: args[1] }
}
