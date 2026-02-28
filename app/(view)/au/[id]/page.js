"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./au.module.css";
import personas from "../../../../public/data/personas.json";

export default function PersonaPage() {
  const params = useParams();
  const router = useRouter();

  const id = useMemo(() => {
    const raw = params?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [audios, setAudios] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const audioRef = useRef(null);

  const persona = useMemo(() => {
    if (!id) return null;
    return personas.find((p) => p.id === id) || null;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (!persona || persona.activa === false) {
      router.replace("/");
    }
  }, [id, persona, router]);

  useEffect(() => {
    if (!id) return;
    if (!persona || persona.activa === false) return;

    fetch(`/data/${id}.json`)
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => setAudios(Array.isArray(data) ? data : []))
      .catch(() => setAudios([]));
  }, [id, persona]);

  // pausar 
  const handlePlay = (audio) => {
    if (currentId === audio.id) {
      audioRef.current?.pause();
      setCurrentId(null);
      return;
    }

    audioRef.current?.pause();

    const newAudio = new Audio(audio.audio);
    audioRef.current = newAudio;
    newAudio.play();
    setCurrentId(audio.id);

    newAudio.onended = () => setCurrentId(null);
  };

  // descargar xd
  const handleDownload = (audio) => {
    const link = document.createElement("a");
    link.href = audio.audio;

    const extension = audio.audio.split(".").pop();
    link.download = `${audio.nombre || "audio"}.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setMenuOpenId(null);
  };

  useEffect(() => {
    const close = () => setMenuOpenId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
      setCurrentId(null);
    }
  }, [id]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  if (!persona || persona.activa === false) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.push("/")}
      >
        ← Volver
      </button>

      <h1 className={styles.title}>{persona.nombre}</h1>

      <div className={styles.row}>
        {audios.map((audio) => (
          <div key={audio.id} className={styles.cardWrapper}>
            <div className={styles.cardBox}>
              <button
                className={`${styles.card} ${
                  currentId === audio.id ? styles.active : ""
                }`}
                style={{ backgroundImage: `url(${audio.imagen})` }}
                onClick={() => handlePlay(audio)}
              />

              <button
                className={styles.dotsBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId((prev) =>
                    prev === audio.id ? null : audio.id
                  );
                }}
              >
                ⋮
              </button>

              {menuOpenId === audio.id && (
                <div
                  className={styles.menu}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.menuItem}
                    onClick={() => handleDownload(audio)}
                  >
                    Descargar
                  </button>
                </div>
              )}
            </div>

            <div className={styles.nombre}>{audio.nombre}</div>
          </div>
        ))}
      </div>
    </div>
  );
}