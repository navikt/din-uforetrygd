package no.nav.uforetrygdbackend.security

class NoFullmaktPresentException : RuntimeException()
class LoginLevelTooLowException : RuntimeException()
class VeilederUnauthorizedException : RuntimeException()
class PidNotSpecifiedException : RuntimeException()