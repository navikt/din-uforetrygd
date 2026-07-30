package no.nav.dinuforetrygd.person.pdl

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonProperty
import no.nav.dinuforetrygd.person.parallellesannheter.dto.ParallellSannhet
import java.time.LocalDateTime

data class PdlPerson(
    @JsonProperty("adressebeskyttelse") val adressebeskyttelse: List<PdlAdressebskyttelse>?,
    @JsonProperty("navn") val navn: List<PdlNavn>?,
    @JsonProperty("vergemaalEllerFremtidsfullmakt") val vergemaalEllerFremtidsfullmakt: List<PdlVergemaalEllerFremtidsfullmakt>?
)

data class PdlVergemaalEllerFremtidsfullmakt(
    @JsonProperty("type") val type: PdlVergemaalEllerFremtidsfullmaktType?,
)

enum class PdlVergemaalEllerFremtidsfullmaktType {
    @JsonProperty("ensligMindreårigAsylsøker") ENSLIG_MINDREARIG_ASYLSOKER,
    @JsonProperty("ensligMindreårigFlyktning") ENSLIG_MINDREARIG_FLYKTNING,
    @JsonProperty("voksen") VOKSEN,
    @JsonProperty("midlertidigForVoksen") MIDLERITIDIG_FOR_VOKSEN,
    @JsonProperty("mindreårig") MINDREARIG,
    @JsonProperty("midlertidigForMindreårig") MIDLERITIDIG_FOR_MINDREARIG,
    @JsonProperty("stadfestetFremtidsfullmakt") STADFESTET_FREMTIDSFULLMAKT,
    @JsonProperty("forvaltningUtenforVergemål") FORVALTNING_UTENFOR_VERGEMAL,
}

data class PdlAdressebskyttelse(
    @JsonProperty("gradering") val gradering: PdlAdressebeskyttelsesgradering,
    @JsonProperty("metadata") val metadata: PdlMetadata?,
    @JsonProperty("folkeregistermetadata") override val folkeregistermetadata: PdlFolkeregisterMetadata?
): ParallellSannhet(metadata, folkeregistermetadata)

enum class  PdlAdressebeskyttelsesgradering{
    //Also known as "kode 7"
    FORTROLIG,

    //Also known as "kode 6"
    STRENGT_FORTROLIG,

    //Adressebeskyttelse specified by forvaltningsloven paragraph 19
    STRENGT_FORTROLIG_UTLAND,

    //No adressebeskyttelse
    UGRADERT;
}

data class PdlNavn(
    @JsonProperty("fornavn") val fornavn: String,
    @JsonProperty("mellomnavn") val mellomnavn: String?,
    @JsonProperty("etternavn") val etternavn: String,
    @JsonProperty("metadata") val metadata: PdlMetadata?,
    @JsonProperty("folkeregistermetadata") override val folkeregistermetadata: PdlFolkeregisterMetadata?
): ParallellSannhet(metadata, folkeregistermetadata)


data class PdlMetadata(
    @JsonProperty("master") val master: String?,
    @JsonProperty("endringer") val endringer: List<PdlMetadataEndring>?,
    @JsonProperty("historisk") val historisk: Boolean?
)

data class PdlMetadataEndring(
    @JsonFormat(shape = JsonFormat.Shape.STRING) @JsonProperty("registrert") val registrert: LocalDateTime?,
    @JsonProperty("kilde") val kilde: String?,
    @JsonProperty("registrertAv") val registrertAv: String?,
    @JsonProperty("systemkilde") val systemkilde: String?,
    @JsonProperty("type") val type: String?
)

data class PdlFolkeregisterMetadata(
    @JsonFormat(shape = JsonFormat.Shape.STRING) @JsonProperty("ajourholdstidspunkt") val ajourholdstidspunkt: LocalDateTime?,
    @JsonFormat(shape = JsonFormat.Shape.STRING) @JsonProperty("gyldighetstidspunkt") val gyldighetstidspunkt: LocalDateTime?
)

