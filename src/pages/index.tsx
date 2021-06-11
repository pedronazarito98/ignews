import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

// Client-side - outros casos
// Server-side - quando precisa de dados dinamicos da sessao do usuario
// Static Site Generation - quando o conteudo não vai mudar entre os usuários.

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about <br />
            the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span> for {product.amount} month.</span>
            <SubscribeButton priceId={product.priceId} />
          </p>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

//função que faz a requisição na api de pagamentos, sem usar metodos HTTP, e exporta os dados da página para os componentes
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1J18hrGIsL07i4oQYKD29d0U");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 horas === 60 minutos * 60 horas * 24 um dia
  };
};
