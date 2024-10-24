import {Visningskriterier} from "@/const";

type ShowForData = { showFor: Visningskriterier[] }

const filterShowFor = <T extends ShowForData>(visningskriterier: Visningskriterier[], data: T[] ): T[] => {
    return data.filter((it) => it.showFor.every((kriterie) => visningskriterier.includes(kriterie)));
};



export default filterShowFor;