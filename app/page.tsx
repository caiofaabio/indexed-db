"use client";
import {useEffect, useState} from "react";
import {initDB} from "./lib/indexedDb/indexedDb";

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /* lendo dados */
    setLoading(true);
    const buscandoDados = async () => {
      try {
        /* iniciando db */
        const db = await initDB();
        /* buscando dados */
        const tx = db.transaction("minhaTabela", "readonly");
        const store = tx.store;
        const allData = await store.getAll();
        /* verificando se id n é undefined*/
        const formatandoDados = allData.map((item) => ({
          ...item,
          id: item.id ?? -1,
        }));
        setData(formatandoDados);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      buscandoDados();
    }, 1000 * 5);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-center font-bold text-4xl mb-4">
        Itens no indexedDB
      </h1>
      <ul>
        {loading ? (
          <li>Carregando...</li>
        ) : data.map((item) => (
          <li key={item.id}>
            Nome: {item.nome} - Idade: {item.idade} - Profissão:{" "}
            {item.profissao}
          </li>
        ))}
      </ul>
    </main>
  );
}
