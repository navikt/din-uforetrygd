package no.nav.dinuforetrygd.util

import no.nav.dinuforetrygd.pensjon.pen.Krav
import no.nav.dinuforetrygd.pensjon.pen.Vedtak

fun Krav.erRelevant() = relevanteKravMap[this.kravGjelder]?.contains(this.arsak) ?: false
fun Vedtak.erRelevant() = this.vedtakstype == "REGULERING" || this.krav.erRelevant()

private val relevanteKravMap = mapOf(
    "EKSPORT" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "UTVANDRET"),
    "FORSTEG_BH" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "F_BH_BO_UTL" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "F_BH_MED_UTL" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "INNT_E" to listOf(
        "ANNEN_FOR_END_IN",
        "ANNEN_ARSAK_END_IN",
        "BEGGE_FOR_END_IN",
        "BARN_ENDRET_INNTEKT",
        "ENDRET_INNTEKT",
        "OMGJ_ETTER_ANKE",
        "OMGJ_ETTER_KLAGE"
    ),
    "MELLOMBH" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OPPL_UTLAND"),
    "REGULERING" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "REGULERING"),
    "SLUTT_BH_UTL" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OPPL_UTLAND"),
    "SOK_RED_UG" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "SOK_OKN_UG" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "SOK_UU" to listOf(
        "NY_SOKNAD",
        "OMGJ_ETTER_ANKE",
        "OMGJ_ETTER_KLAGE",
        "OMGJ_ETTER_FVL_P35_A",
        "OMGJ_ETTER_FVL_P35_B",
        "OMGJ_ETTER_FVL_P35_C"
    ),
    "SOK_YS" to listOf(
        "NY_SOKNAD",
        "OMGJ_ETTER_ANKE",
        "OMGJ_ETTER_KLAGE",
        "OMGJ_ETTER_FVL_P35_A",
        "OMGJ_ETTER_FVL_P35_B",
        "OMGJ_ETTER_FVL_P35_C"
    ),
    "UT_EO" to listOf("UT_EO", "UT_OMGJ_ANKE_EO", "UT_OMGJ_KLAGE_EO"),
    "REVURD" to listOf("ENDRING_IFU", "SOKNAD_BT"),
)

