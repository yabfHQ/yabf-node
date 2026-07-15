import { ServiceError, Status } from '@yabf/common'

export class UnsupportedMediaTypeError extends ServiceError<{ mediaType: string }> {
    constructor(public readonly mediaType: string) {
        super(Status.NOT_IMPLEMENTED, {
            code: 'UNSUPPORTED_MEDIA_TYPE',
            message: `The media type ${mediaType} is not supported`,
            details: {
                mediaType
            }
        })
    }
}
