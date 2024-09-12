import { FunctionComponent, useState, useEffect } from "react";
import styles from "../styles/PlayerContainer.module.css";
import Acciones from "../interfaces/Acciones";
import Combatiente from "../interfaces/Combatiente";
import batallaData from '../data/batalla.json';
import combatienteData from '../data/combatiente.json';
import accionesData from '../data/acciones.json';

type PlayerContainerProps = {
  onActionMessage: (message: string) => void;
};

// IDs de combatientes
const JUGADOR_ID = "64d3402d681948532712a45b";
const ENEMIGO_ID = "64d3402d681948532712a45z";

const PlayerContainer: FunctionComponent<PlayerContainerProps> = ({ onActionMessage }) => {
  const [jugador, setJugador] = useState<Combatiente | null>(null);
  const [enemigo, setEnemigo] = useState<Combatiente | null>(null);
  const [habilidades, setHabilidades] = useState<Acciones[]>([]);
  const [showSkills, setShowSkills] = useState(false);
  const [isJugadorTurn, setIsJugadorTurn] = useState(true);

  useEffect(() => {
    const jugadorData = combatienteData.find(c => c._id === JUGADOR_ID) || null;
    const enemigoData = combatienteData.find(c => c._id === ENEMIGO_ID) || null;

    setJugador(jugadorData as Combatiente | null);
    setEnemigo(enemigoData as Combatiente | null);

    if (jugadorData) {
      const habilidadesData = accionesData.filter(a => 
        jugadorData.abilities.includes(a._id)
      ).map(habilidad => ({
        ...habilidad,
        effects: Object.fromEntries(
          Object.entries(habilidad.effects).filter(([_, value]) => value !== undefined)
        )
      }) as Acciones);
  
      setHabilidades(habilidadesData);
    }
  }, []);

  const calcularDaño = (ataque: number, defensa: number) => {
    return Math.max(0, ataque - defensa);
  };

  const handleAtaque = () => {
    if (jugador && enemigo) {
      const daño = calcularDaño(jugador.attack, enemigo.defense);
      const nuevaVidaEnemigo = Math.max(0, enemigo.health - daño);
      setEnemigo({ ...enemigo, health: nuevaVidaEnemigo });

      onActionMessage(`¡${jugador.name} ha atacado!`);
      setIsJugadorTurn(false);

      setTimeout(() => {
        handleTurnoEnemigo();
      }, 1000);
    }
  };

  const handleTurnoEnemigo = () => {
    if (enemigo && jugador) {
      const daño = calcularDaño(enemigo.attack, jugador.defense);
      const nuevaVidaJugador = Math.max(0, jugador.health - daño);
      setJugador({ ...jugador, health: nuevaVidaJugador });

      onActionMessage(`¡${enemigo.name} ha atacado!`);
      setIsJugadorTurn(true);
    }
  };

  const aplicarEfectos = (habilidad: Acciones) => {
    if (habilidad.effects && jugador) {
      let updatedJugador = { ...jugador };
      Object.keys(habilidad.effects).forEach(effect => {
        switch (effect) {
          case "increaseAttack":
            updatedJugador.attack += habilidad.effects[effect];
            break;
          case "increaseDefense":
            updatedJugador.defense += habilidad.effects[effect];
            break;
          // Se pueden añadir más efectos aquí en el futuro
        }
      });
      setJugador(updatedJugador);
    }
  };

  const handleSkillSelect = (habilidad: Acciones) => {
    if (jugador) {
      if (jugador.powerPointsLeft >= habilidad.powerCost) {
        const updatedPowerPointsLeft = jugador.powerPointsLeft - habilidad.powerCost;
        setJugador({ ...jugador, powerPointsLeft: Math.max(updatedPowerPointsLeft, 0) });
        onActionMessage(`¡${jugador.name} ha utilizado ${habilidad.name}!`);
        aplicarEfectos(habilidad);

        if (updatedPowerPointsLeft <= 0) {
          onActionMessage("¡Ya no te quedan puntos de poder!");
        }

        setShowSkills(false);
        setIsJugadorTurn(false);

        setTimeout(() => {
          handleTurnoEnemigo();
        }, 1000);
      } else {
        onActionMessage("¡No tienes suficientes puntos de poder!");
      }
    }
  };

  const handleSkillsClick = () => {
    setShowSkills(!showSkills);
  };

  const getBarraVidaStyle = (health: number, maxHealth: number) => {
    const porcentajeVida = (health / maxHealth) * 100;
    if (porcentajeVida <= 30) {
      return { backgroundColor: 'red' };
    } else if (porcentajeVida <= 60) {
      return { backgroundColor: 'yellow' };
    }
    return { backgroundColor: 'green' };
  };

  // Obtener las recompensas del primer objeto de batallaData
  const rewards = batallaData.length > 0 ? batallaData[0].rewards : { experience: 0, gold: 0 };

  return (
    <footer className={styles.playerContainer}>
      <div className={styles.barradeaccion} />
        <div className={styles.playerInfo}>
          <div className={styles.playerName}>
            <div className={styles.playerNameDisplay}>
              <div className={styles.barraestaticadevida} />
              <button className={styles.barradinamicadevidajugadorParent}>
                <div
                  className={styles.barradinamicadevidajugador}
                  style={jugador ? getBarraVidaStyle(jugador.health, jugador.maxHealth) : {}}
                />
                <b className={styles.porcentajevidajugador}>
                  {jugador ? `${Math.round((jugador.health / jugador.maxHealth) * 100)}%` : 'Cargando...'}
                </b>
              </button>
            </div>
            <div className={styles.nombrejugadorWrapper}>
              <b className={styles.nombrejugador}>
                {jugador ? `${jugador.name} lvl. ${jugador.level}` : 'Cargando...'}
              </b>
            </div>
          </div>
          <div className={styles.enemyInfo}>
            <div className={styles.enemyName}>
              <b className={styles.nombreenemigo}>
                {enemigo ? `${enemigo.name} lvl. ${enemigo.level}` : 'Cargando...'}
              </b>
            </div>
            <div className={styles.enemyHealth}>
              <div className={styles.barraestaticadevida1} />
              <button className={styles.enemyHealthDisplay}>
                <div
                  className={styles.barradinamicadevidaenemigo}
                  style={enemigo ? getBarraVidaStyle(enemigo.health, enemigo.maxHealth) : {}}
                />
                <b className={styles.porcentajevidaenemigo}>
                  {enemigo ? `${Math.round((enemigo.health / enemigo.maxHealth) * 100)}%` : 'Cargando...'}
                </b>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.gameActions}>
          <div className={styles.turnActions}>
            <div className={styles.turnIndicator}>
              <h3 className={styles.indicadordeturno}>
                {isJugadorTurn ? "¡Es tu turno!" : "¡Turno del enemigo!"}
              </h3>
            </div>
            <div className={styles.actionButtons}>
              <div className={styles.attackSkillButtons}>
                <button
                  className={styles.botonatacar}
                  onClick={handleAtaque}
                  disabled={!isJugadorTurn}
                >
                  Atacar
                </button>
              </div>
              <div className={styles.attackSkillButtons1}>
                <div className={styles.botonhabilidadesParent}>
                  <button
                    className={styles.botonhabilidades}
                    onClick={handleSkillsClick}
                    disabled={!isJugadorTurn || habilidades.length === 0}
                    style={{ backgroundColor: showSkills ? "#91CB94" : "" }}
                  >
                    Acciones
                  </button>
                </div>
              </div>
              <div className={styles.powerPoints}>
                {jugador && (
                  <b className={styles.cantidadpuntospoder}>
                    {jugador.powerPointsLeft} / {jugador.powerPoints} Puntos de Poder
                  </b>
                )}
              </div>
            </div>
            {showSkills && (
              <div className={styles.skillsList} style={{ maxHeight: "114px", overflowY: "auto" }}>
                <ul style={{ fontSize: "16px" }}>
                  {habilidades.map((habilidad) => (
                    <li
                      key={habilidad._id}
                      onClick={() => handleSkillSelect(habilidad)}
                      style={{ fontSize: "16px" }}
                    >
                      {habilidad.name} ({habilidad.powerCost} PP)
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
    </div>
      {enemigo && enemigo.health <= 0 && (
        <div className={styles.combatResult}>
          <h2>¡Has ganado el combate!</h2>
          <p>Recompensas: {`Experiencia: ${rewards.experience}, Oro: ${rewards.gold}`}</p>
        </div>
      )}
    </footer>
  );
};

export default PlayerContainer;
