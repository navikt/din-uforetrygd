import getOboToken from "@/utils/getOboToken";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  console.log("HIT PROXY");
  const apiPath = new URL(req.url);
  const backendUrl = `https://uforetrygd-backend.intern.dev.nav.no/${apiPath}`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const oboToken = await getOboToken(req);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = await fetch(backendUrl).then((res) => res.json());
    return NextResponse.json(data);
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
