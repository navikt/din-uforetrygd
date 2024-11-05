import { headers } from "next/headers";
import {
  getToken,
  requestTokenxOboToken,
  validateIdportenToken,
} from "@navikt/oasis";

const getOboToken = async () => {
  return new Promise(async (resolve, reject) => {
    if (process.env.NODE_ENV !== "production") {
      resolve("mock-token");
    }
    const clientHeaders = await headers();
    const token = getToken(clientHeaders);
    if (!token) {
      return reject("Missing wonderwall cookie");
    }
    const validation = await validateIdportenToken(token);
    if (!validation.ok) {
      return reject(`Validation failed: ${validation.error}`);
    }
    const obo = await requestTokenxOboToken(
      token,
      "dev-gcp:pensjonselvbetjening:uforetrygd-backend", // TODO: Bruk miljøvariabel
    );

    if (!obo.ok) {
      return reject(`OBO Exchange failed: ${obo.error}`);
    }

    resolve(obo.token);
  });
};
export default getOboToken;
