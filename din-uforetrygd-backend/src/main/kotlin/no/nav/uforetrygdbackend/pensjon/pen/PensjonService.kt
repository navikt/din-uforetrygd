package no.nav.uforetrygdbackend.pensjon.pen

import no.nav.uforetrygdbackend.Sak
import no.nav.uforetrygdbackend.Sakstatus
import no.nav.uforetrygdbackend.Sakstype
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class PensjonService(val penClient: PenClient) {
    fun getSaker(pid: String): List<Sak> {
        return penClient.getSaksammendrag(pid)
            .map { mapSakSammendragToSak(it, pid) }
            .filterNot { it.type == Sakstype.UKJENT || it.type == Sakstype.GENERELL ||
                    it.type == Sakstype.FAMILIEPLEIER_YTELSE || it.type == Sakstype.GAMMEL_YRKESSKADE ||
                    it.type == Sakstype.GRUNNBLANKETTER || it.type == Sakstype.KRIGSPENSJON}
    }

    private fun mapSakSammendragToSak(sakSammendrag: SakSammendrag, pid: String): Sak {
        val sakstype = mapSakstype(sakSammendrag.sakType)
        val grad = when (sakstype) {
            Sakstype.ALDERSPENSJON -> getGjeldendeUttaksgrad(pid)
            Sakstype.UFORETRYGD -> getGjeldendeUforegrad(pid)
            else -> null
        }
        return Sak(sakstype, grad, mapSakstatus(sakSammendrag.sakStatus))
    }

    private fun getGjeldendeUttaksgrad(pid: String): Int? {
        return penClient.getUttaksgradHistorikk(pid)
            .sortedByDescending { it.fomDato }
            .filter { isVirkDateActive(it) }
            .map { it.uttaksgrad}
            .firstOrNull()
    }

    private fun isVirkDateActive(uttaksgrad: Uttaksgrad): Boolean =
        uttaksgrad.fomDato != null && !uttaksgrad.fomDato.isAfter(LocalDate.now())
                && (uttaksgrad.tomDato == null || !uttaksgrad.tomDato.isBefore(LocalDate.now()))

    private fun getGjeldendeUforegrad(pid: String): Int? {
        return penClient.getUforegrad(pid)
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