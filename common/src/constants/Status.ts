export enum Status {
    OK = 0,

    // Client Errors (0 - 49)
    BAD_REQUEST = 1,
    INVALID_ARGUMENT = 10,
    OUT_OF_RANGE = 2,
    UNAUTHENTICATED = 3,
    UNAUTHORIZED = 4,
    NOT_FOUND = 5,
    CONFLICT = 6,
    FAILED_PRECONDITION = 7,
    RESOURCE_EXHAUSTED = 8,
    CANCELLED = 9,

    // Server Errors (50 - 79)
    INTERNAL_ERROR = 50,
    NOT_IMPLEMENTED = 52,
    UNAVAILABLE = 53,
    ABORTED = 54,

    // Unclassified (80 -98)
    DEADLINE_EXCEEDED = 80,

    // Unknown Error (99)
    UNKNOWN = 99
}
