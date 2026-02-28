"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./au.module.css";
import personas from "../../../../public/data/personas.json";

export default function PersonaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [audios, setAudios] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  const audioRef = useRef(null);

  // 🔍 Buscar persona por id
  const persona = personas.find((p) => p.id === id);

  useEffect(() => {
    if (!id) return;

    fetch(`/data/${id}.json`)
      .then((res) => res.json())
      .then((data) => setAudios(data));
  }, [id]);

  const handlePlay = (audio) => {
    if (currentId === audio.id) {
      audioRef.current.pause();
      setCurrentId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(audio.audio);
    audioRef.current = newAudio;
    newAudio.play();
    setCurrentId(audio.id);

    newAudio.onended = () => {
      setCurrentId(null);
    };
  };

  return (
    <div className={styles.container}>

      <button
        className={styles.backButton}
        onClick={() => router.push("/")}
      >
        ← Volver
      </button>

      {/* 🏷️ Título con nombre real */}
      <h1 className={styles.title}>
        {persona ? persona.nombre : ""}
      </h1>

      <div className={styles.row}>
        {audios.map((audio) => (
          <div key={audio.id} className={styles.cardWrapper}>
            <button
              className={`${styles.card} ${
                currentId === audio.id ? styles.active : ""
              }`}
              style={{ backgroundImage: `url(${audio.imagen})` }}
              onClick={() => handlePlay(audio)}
            />
            <div className={styles.nombre}>
              {audio.nombre}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}