package no.nav.dinuforetrygd.common


import no.nav.dinuforetrygd.ClientException
import no.nav.dinuforetrygd.ForbiddenException
import no.nav.dinuforetrygd.PersonNotFoundException
import no.nav.dinuforetrygd.configuration.AppId
import org.slf4j.Logger

fun handleGraphQLErrorResponse(errors: List<GraphQLError>?, appId: AppId, service: String, logger: Logger): Nothing {
    errors.takeIf { !it.isNullOrEmpty() }?.let {
        val error = it.first()
        logger.error("Kallet feilet mot $appId: kode ${error.extensions?.code}")
        when (error.extensions?.code) {
            GraphQLError.GraphQLExtensions.GraphQLErrorCodes.UNAUTHENTICATED -> throw ForbiddenException(
                system = appId.name,
                service = service,
                message = error.message,
                cause = null
            )

            GraphQLError.GraphQLExtensions.GraphQLErrorCodes.UNAUTHORIZED -> throw ForbiddenException(
                system = appId.name,
                service = service,
                message = error.message,
                cause = null
            )

            GraphQLError.GraphQLExtensions.GraphQLErrorCodes.NOT_FOUND -> throw PersonNotFoundException(
                system = appId.name,
                service = service,
                message = error.message,
                cause = null
            )

            GraphQLError.GraphQLExtensions.GraphQLErrorCodes.BAD_REQUEST -> throw ClientException(
                system = appId.name,
                service = service,
                message = error.message,
                cause = null
            )

            GraphQLError.GraphQLExtensions.GraphQLErrorCodes.SERVER_ERROR -> throw ClientException(
                system = appId.name,
                service = service,
                message = error.message,
                cause = null
            )

            else -> throw ClientException(appId.name, service, error.message, null)
        }
    }
    throw ClientException(appId.name, service, "Failed calling $appId", null)
}