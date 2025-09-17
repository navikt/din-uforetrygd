package no.nav.uforetrygdbackend.pensjon.pen

import no.nav.uforetrygdbackend.uforetrygd.Sak
import no.nav.uforetrygdbackend.uforetrygd.Sakstatus
import no.nav.uforetrygdbackend.uforetrygd.Sakstype
import org.springframework.stereotype.Service

@Service
class PenService(val penClient: PenClient) {
    fun getSaker(pid: String): List<Sak> {
        return penClient.getSaksammendrag(pid)
            .map { mapSakSammendragToSak(it) }
            .filterNot { it.type == Sakstype.UKJENT || it.type == Sakstype.GENERELL ||
                    it.type == Sakstype.FAMILIEPLEIER_YTELSE || it.type == Sakstype.GAMMEL_YRKESSKADE ||
                    it.type == Sakstype.GRUNNBLANKETTER || it.type == Sakstype.KRIGSPENSJON}
    }

    fun getVedtakssammendrag(pid: String) = penClient.getVedtakssammendragResponse(pid)

    fun getSumAvForventedeInntekter(pid: String): Long? =
        penClient.getForventedeInntekterResponse(pid).sumAvForventedeInntekter

    private fun mapSakSammendragToSak(sakSammendrag: SakSammendrag): Sak {
        val sakstype = mapSakstype(sakSammendrag.sakType)
        return Sak(type = sakstype, status = mapSakstatus(sakSammendrag.sakStatus), sakId = sakSammendrag.sakId)
    }

    private fun mapSakstatus(sakStatus: String): Sakstatus {
        return when (sakStatus) {
            "AVSLUTTET" -> Sakstatus.AVSLUTTET
            "LOPENDE" -> Sakstatus.LOPENDE
            "OPPRETTET" -> Sakstatus.OPPRETTET
            "TIL_BEHANDLING" -> Sakstatus.TIL_BEHANDLING
            else -> Sakstatus.UKJENT
        }
    }

    private fun mapSakstype(sakType: String): Sakstype {
        return when (sakType) {
            "ALDER" -> Sakstype.ALDERSPENSJON
            "AFP_PRIVAT" -> Sakstype.AFP_PRIVAT
            "AFP" -> Sakstype.AFP
            "BARNEP" -> Sakstype.BARNEPENSJON
            "FAM_PL" -> Sakstype.FAMILIEPLEIER_YTELSE
            "GAM_YRK" -> Sakstype.GAMMEL_YRKESSKADE
            "GENRL" -> Sakstype.GENERELL
            "GJENLEV" -> Sakstype.GJENLEVENDE_YTELSE
            "GBRL" -> Sakstype.GRUNNBLANKETTER
            "KRIGSP" -> Sakstype.KRIGSPENSJON
            "OMSORG" -> Sakstype.OMSORGSOPPTJENING
            "UFOREP" -> Sakstype.UFORETRYGD
            else -> Sakstype.UKJENT
        }
    }
}