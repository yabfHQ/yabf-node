import { expect, test } from 'vitest'
import { greet } from '../src'

test('greets a person by name', () => {
    expect(greet('YABF')).toBe('Hello, YABF!')
})
