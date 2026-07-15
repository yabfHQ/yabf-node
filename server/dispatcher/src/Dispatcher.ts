import { Executor } from '@yabf/executor'
import { Registry } from '@yabf/registry'
import { MediaTypes, Serializer } from '@yabf/serialization'
import { Call, CallResponse, createCall, createResponse, Metadata } from '@yabf/server-call'
import { Stream } from '@yabf/stream'
import { createCallContext } from './ContextFactory'
import { UnknownProcedureError, UnsupportedMediaTypeError } from './errors'

export interface Dispatcher {
    dispatch(call: Call): Promise<CallResponse>
}

export function dispatcher(
    routes: Registry,
    executor: Executor,
    serializers: Serializer<string, MediaTypes>[]
): Dispatcher {
    const _serializers = new Map(
        serializers.flatMap(it => [
            [it.mediaTypes.unary, it],
            [it.mediaTypes.streaming, it]
        ])
    )

    return {
        async dispatch(call) {
            const serializer = _serializers.get(call.mediaType)
            if (!serializer) throw new UnsupportedMediaTypeError(call.mediaType)

            const entry = routes.lookup(call.service, call.procedure)
            if (!entry) throw new UnknownProcedureError(call.service, call.procedure)

            const { stream, writer } = Stream.create()

            call.signal.addEventListener('abort', () => writer.close(), {
                once: true
            })

            const context = createCallContext({
                call: createCall(call.service, call.procedure, {
                    ...call,
                    messages: call.messages.map(serializer.deserialize)
                }),
                response: createResponse({
                    mediaType: call.mediaType,
                    metadata: new Metadata(),
                    trailers: new Metadata(),
                    messages: stream
                })
            })

            await executor.execute(context, () => entry.handler(context, writer))

            return createResponse({
                ...context.response,
                messages: context.response.messages.map(serializer.serialize)
            })
        }
    }
}
