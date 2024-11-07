import { headers } from "next/headers";
import {
  getToken,
  requestAzureOboToken,
  requestTokenxOboToken,
  validateAzureToken,
  validateIdportenToken,
} from "@navikt/oasis";
import getEnv from "@/utils/env";

const getOboTokenTokenX = async () => {
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
      getEnv("BACKEND_DIN_UFORETRYGD_SCOPE")!,
    );

    if (!obo.ok) {
      return reject(`OBO Exchange failed: ${obo.error}`);
    }

    resolve(obo.token);
  });
};

const getOboTokenAzure = async () => {
  return new Promise(async (resolve, reject) => {
    if (process.env.NODE_ENV !== "production") {
      resolve("mock-token");
    }
    const clientHeaders = await headers();
    const token = getToken(clientHeaders);
    if (!token) {
      return reject("Missing wonderwall cookie");
    }
    const validation = await validateAzureToken(token);
    if (!validation.ok) {
      return reject(`Validation failed: ${validation.error}`);
    }
    const obo = await requestAzureOboToken(
        token,
        getEnv("BACKEND_DIN_UFORETRYGD_SCOPE")!,
    );

    if (!obo.ok) {
      return reject(`OBO Exchange failed: ${obo.error}`);
    }

    resolve(obo.token);
  });
};

export default getEnv("MODE") === 'veileder' ? getOboTokenAzure : getOboTokenTokenX
