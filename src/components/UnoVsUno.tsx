import React, { FunctionComponent, useState } from "react";
import PlayerContainer from "../components/PlayerContainer";
import styles from "../styles/UnoVsUno.module.css";

const UnoVsUno: FunctionComponent = () => {
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleActionMessage = (message: string) => {
    setActionMessage(message);

    // El mensaje desaparecerá después de 2 segundos
    setTimeout(() => {
      setActionMessage(null);
    }, 2000);
  };

  return (
    <div className={styles.unovsuno}>
      <section className={styles.enemyContainer}>
        <div className={styles.jugadorParent}>
          <img
            className={styles.jugadorIcon}
            loading="lazy"
            alt=""
            src="src/assets/jugador.png"
          />
          <img
            className={styles.enemigoIcon}
            loading="lazy"
            alt=""
            src="src/assets/jugador.png"
          />
        </div>
      </section>

      <PlayerContainer onActionMessage={handleActionMessage} />

      {actionMessage && (
        <div className={styles.actionMessage}>
          <h2>{actionMessage}</h2>
        </div>
      )}
    </div>
  );
};

export default UnoVsUno;
