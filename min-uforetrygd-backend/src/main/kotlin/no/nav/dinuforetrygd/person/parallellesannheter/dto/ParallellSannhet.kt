package no.nav.dinuforetrygd.person.parallellesannheter.dto

import no.nav.dinuforetrygd.person.pdl.PdlFolkeregisterMetadata
import no.nav.dinuforetrygd.person.pdl.PdlMetadata


abstract class ParallellSannhet(open val pdlMetadata: PdlMetadata?,
                                open val folkeregistermetadata: PdlFolkeregisterMetadata?) {

}
