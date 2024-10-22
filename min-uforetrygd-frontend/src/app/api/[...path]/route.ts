import getOboToken from "@/utils/getOboToken";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  console.log("HIT PROXY");
  const apiPath = new URL(req.url);
  const backendUrl = `https://uforetrygd-backend.intern.dev.nav.no/${apiPath}`;

  try {
    const oboToken = await getOboToken(req);
    const data = await fetch(backendUrl);
    return NextResponse.json({ loggetInnSom: "tester en person" });
  } catch (error) {
    logger.info(error);
    return NextResponse.json({ error }, { status: 401 });
  }

  // try {
  //   const response = await fetch(backendUrl, {
  //     method: req.method,
  //     body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  //   });

  //   const data = await response.json();
  //   res.status(response.status).json(data);
  // } catch {
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
}

export { handler as GET };
