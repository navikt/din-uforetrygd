package no.nav.uforetrygdbackend.security

data class AuthenticatedUserDetails(
    val pid: String,
    val isFullmakt: Boolean
)