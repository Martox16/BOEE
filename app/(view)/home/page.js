"use client";

import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import personas from "../../../public/data/personas.json";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <h1 className={styles.title}>B O E E E 🗣️🗣️</h1>
      </div>

      <div className={styles.row}>
        {personas.map((persona) => (
          <button
            key={persona.id}
            className={`${styles.card} ${
              !persona.activa ? styles.inactiva : ""
            }`}
            style={{ backgroundImage: `url(${persona.imagen})` }}
            aria-label={persona.nombre}
            disabled={!persona.activa}
            onClick={() => router.push(`/au/${persona.id}`)}
          />
        ))}
      </div>
    </div>
  );
}