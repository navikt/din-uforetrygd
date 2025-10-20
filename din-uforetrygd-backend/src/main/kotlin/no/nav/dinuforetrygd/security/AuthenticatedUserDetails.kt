package no.nav.dinuforetrygd.security

data class AuthenticatedUserDetails(
    val pid: String,
    val isFullmakt: Boolean
)