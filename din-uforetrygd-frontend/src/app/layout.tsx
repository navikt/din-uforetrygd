import "@navikt/ds-css";
import { Heading } from "@navikt/ds-react";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";
import getEnv from "@/utils/env";
import "./layout.css";
import {Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    props: Props,
): Promise<Metadata> {
  // read route params

  console.log("inni her: ", /* @next-codemod-error 'props' is passed as an argument. Any asynchronous properties of 'props' must be awaited when accessed. */
  props)


  return {}
}

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode}>) => {


  const decoratorEnv = (getEnv("DECORATOR_ENV") ?? "prod") as "dev" | "prod";
  const mode = getEnv("MODE") as "borger" | "veileder";

  const Decorator = await fetchDecoratorReact({
    env: decoratorEnv,
    params: {
      context: "privatperson",
      breadcrumbs: [
        {
          title: "Min side",
          url: "https://www.nav.no",
        },
        {
          title: "Uføretrygd",
          url: "https://www.nav.no/uføretrygd",
        },
      ],
    },
  });
  if (mode === "veileder") {
    return (
      <html lang="no">
        <body>
          <Heading size="xlarge" level="1">
            {process.env.MODE}
          </Heading>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        <main className="main-content" id="maincontent" tabIndex={-1}>
          {children}
        </main>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
};

export default RootLayout;
