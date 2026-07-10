export interface FrameTags<T> {
    START: T
    END: T
    STREAM_END: T
}

export function frameTags<const T extends FrameTags<any>>(tags: T): T {
    return tags
}
