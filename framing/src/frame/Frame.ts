import { FrameType } from './FrameType'

export class Frame {
    constructor(
        public readonly type: FrameType,
        public readonly payload: Uint8Array | undefined
    ) {}
}

export function frame(type: FrameType, payload?: Uint8Array | undefined): Frame {
    return new Frame(type, payload)
}
