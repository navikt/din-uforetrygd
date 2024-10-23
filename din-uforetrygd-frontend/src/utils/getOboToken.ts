import { unstable_noStore as noStore } from "next/cache";
import {
  getToken,
  requestTokenxOboToken,
  validateIdportenToken,
} from "@navikt/oasis";

const getOboToken = async (req: Request) => {
  noStore();
  return new Promise(async (resolve, reject) => {
    const token = getToken(req);
    if (!token) {
      return reject("Missing wonderwall cookie");
    }
    const validation = await validateIdportenToken(token);
    if (!validation.ok) {
      console.log(validation.error);
      return reject(`Validation failed: ${validation.error}`);
    }

    const obo = await requestTokenxOboToken(
      token,
      "dev-gcp:pensjonselvbetjening:uforetrygd-backend", // TODO: Bruk miljøvariabel
    );

    if (!obo.ok) {
      return reject(`OBO Exchange failed: ${obo.error}`);
    }

    console.log("OBO token:");
    console.log(obo.token);

    resolve(obo.token);
  });
};
export default getOboToken;
