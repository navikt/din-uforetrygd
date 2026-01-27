package no.nav.dinuforetrygd.pensjon.pen

import no.nav.dinuforetrygd.uforetrygd.Sak
import no.nav.dinuforetrygd.uforetrygd.Sakstatus
import org.springframework.stereotype.Service

@Service
class PenService(val penClient: PenClient) {
    fun getSaker(pid: String): List<Sak> {
        return penClient.getSaksammendrag(pid)
            .filter { it.sakType == "UFOREP"}
            .map { mapSakSammendragToSak(it) }
    }

    fun getVedtakssammendrag(pid: String) = penClient.getVedtakssammendragResponse(pid)

    fun getSumAvForventedeInntekter(pid: String): Long? =
        penClient.getForventedeInntekterResponse(pid).sumAvForventedeInntekter

    private fun mapSakSammendragToSak(sakSammendrag: SakSammendrag): Sak {
        return Sak(status = mapSakstatus(sakSammendrag.sakStatus), sakId = sakSammendrag.sakId)
    }

    private fun mapSakstatus(sakStatus: String): Sakstatus {
        return when (sakStatus) {
            "AVSLUTTET" -> Sakstatus.AVSLUTTET
            "LOPENDE" -> Sakstatus.LOPENDE
            "OPPRETTET" -> Sakstatus.OPPRETTET
            "TIL_BEHANDLING" -> Sakstatus.TIL_BEHANDLING
            else -> throw IllegalStateException("Ukjent sakstatus: $sakStatus")
        }
    }

}