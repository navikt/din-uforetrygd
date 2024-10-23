import getOboToken from "@/utils/getOboToken";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  const apiPath = new URL(req.url);
  const backendUrl = `${process.env.UFORETRYGD_BACKEND}/${apiPath}`;
  console.log("fetching", backendUrl);

  try {
    const oboToken = await getOboToken(req);
    const data = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${oboToken}`,
      },
    });
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
