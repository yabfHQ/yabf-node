import { FrameTagPosition } from '../../FrameTagPosition'
import { InvalidFrameTagError } from '../../errors'
import { BinaryFrameTags } from '../BinaryFrameTags'

export function invalidFrameTagError(tag: number, position: FrameTagPosition): never {
    function stringify(byte: number) {
        return `BIN(${byte.toString(16)})`
    }

    const expected =
        position === FrameTagPosition.START ? BinaryFrameTags.START : BinaryFrameTags.END

    throw new InvalidFrameTagError(stringify(expected), stringify(tag), position)
}
