import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Мій Додаток</title>
        <meta name="description" content="Ласкаво просимо до мого додатку!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Ласкаво просимо до мого додатку!</h1>
        <p>Це стартова сторінка.</p>
      </main>
    </div>
  );
}
