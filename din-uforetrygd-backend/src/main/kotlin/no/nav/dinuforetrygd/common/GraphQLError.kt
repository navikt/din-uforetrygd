package no.nav.dinuforetrygd.common

import com.fasterxml.jackson.annotation.JsonProperty

data class GraphQLError(
    @JsonProperty("message") val message: String,
    @JsonProperty("locations") val locations: List<GraphQLErrorLocation>,
    @JsonProperty("path") val path: List<String>?,
    @JsonProperty("extensions") val extensions: GraphQLExtensions?,
) {
    data class GraphQLErrorLocation(
        @JsonProperty("line") val line: Int,
        @JsonProperty("column") val column: Int,
    )
    data class GraphQLExtensions(
        @JsonProperty("code") val code: GraphQLErrorCodes?,
        @JsonProperty("classification") val classification: String?,
    ) {
        enum class GraphQLErrorCodes {
            @JsonProperty("unauthenticated")
            UNAUTHENTICATED,

            @JsonProperty("unauthorized")
            UNAUTHORIZED,

            @JsonProperty("not_found")
            NOT_FOUND,

            @JsonProperty("bad_request")
            BAD_REQUEST,

            @JsonProperty("server_error")
            SERVER_ERROR
        }
    }
}
