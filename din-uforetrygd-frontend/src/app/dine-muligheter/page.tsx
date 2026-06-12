import { redirect } from "next/navigation";
import DineMuligheter from "@/sections/DineMuligheter/DineMuligheter";
import { isEnabled } from "@/utils/unleash";

const DineMuligheterPage = async () => {
  const dineMuligheterIsEnabled = await isEnabled(
    "din-uforetrygd.dine-muligheter",
  );

  if (dineMuligheterIsEnabled) {
    return <DineMuligheter />;
  }
  // TODO: Vise noe informasjon til brukere som ikke har fått varsel?
  redirect("/");
};

export default DineMuligheterPage;
