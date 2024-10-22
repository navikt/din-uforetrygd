package no.nav.uforetrygdbackend.person.parallellesannheter.dto

import no.nav.uforetrygdbackend.person.pdl.PdlFolkeregisterMetadata
import no.nav.uforetrygdbackend.person.pdl.PdlMetadata


abstract class ParallellSannhet(open val pdlMetadata: PdlMetadata?,
                                open val folkeregistermetadata: PdlFolkeregisterMetadata?) {

}
