import React, { FunctionComponent, useState, useEffect } from "react";
import styles from "../styles/PlayerContainer.module.css";

export type PlayerContainerType = {
  className?: string;
  onActionMessage: (message: string) => void;
};

interface Item {
  id: string;
  name: string;
  type: string;
  effects: string;
  droprate: number;
}

interface Skill {
  id: string;
  name: string;
  powerCost: number;
  type: string;
}

interface Hero {
  id: string;
  name: string;
  type: string;
  abilities: string[];
  powerPoints: number;
  powerPointsLeft: number;
}

const PlayerContainer: FunctionComponent<PlayerContainerType> = ({
  className = "",
  onActionMessage,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [showItems, setShowItems] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [hero, setHero] = useState<Hero | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("http://localhost:5000/heroes");
        const data: Hero = await response.json();

        console.log("Hero data:", data);

        if (data.powerPoints && data.powerPointsLeft) {
          setHero(data);
        } else {
          console.error("Datos de powerPoints no válidos:", data);
          setHero({ ...data, powerPoints: 8, powerPointsLeft: 8 });
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };

    fetchHeroData();
  }, []);

  const handleItemsClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/items");
      const data: Item[] = await response.json();
      setItems(data);
      setShowItems(true);
      setShowSkills(false);
    } catch (error) {
      console.error("Error al obtener los items:", error);
    }
  };

  const handleSkillsClick = async () => {
    if (!hero) return;

    try {
      const response = await fetch("http://localhost:5000/abilities");
      const data: Skill[] = await response.json();
      const formattedSkills = data.map((skill: Skill) => ({
        id: skill.id,
        name: skill.name,
        powerCost: skill.powerCost,
        type: skill.type,
      }));
      setSkills(formattedSkills);

      const filteredSkills = formattedSkills.filter(
        (skill) => skill.type === hero.type
      );
      setFilteredSkills(filteredSkills);

      setShowItems(false);
      setShowSkills(true);
    } catch (error) {
      console.error("Error al obtener las habilidades:", error);
    }
  };

  const handleSkillSelect = (skill: Skill) => {
    if (hero) {
      if (hero.powerPointsLeft >= skill.powerCost) {
        const updatedPowerPointsLeft = hero.powerPointsLeft - skill.powerCost;
        setHero({ ...hero, powerPointsLeft: Math.max(updatedPowerPointsLeft, 0) });
        onActionMessage(`¡Has utilizado ${skill.name}!`);
      } else {
        onActionMessage("¡No tienes suficientes puntos de poder!");
      }
    }
  };

  const handleItemSelect = async (itemId: string) => {
    try {
      await fetch(`http://localhost:5000/items/${itemId}`, { method: "DELETE" });
      const updatedItems = items.filter((item) => item.id !== itemId);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    }
  };

  const handleOutsideClick = () => {
    setShowItems(false);
    setShowSkills(false);
  };

  const handleAttackClick = () => {
    onActionMessage("¡Has utilizado ataque básico!");
  };

  return (
    <footer
      className={`${styles.playerContainer} ${className}`}
      onClick={handleOutsideClick}
    >
      <div className={styles.barradeaccion} />
      {showItems ? (
        <div
          className={styles.itemsList}
          style={{ maxHeight: "114px", overflowY: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          <ul style={{ fontSize: "16px" }}>
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemSelect(item.id)}
                style={{ fontSize: "16px" }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ) : showSkills ? (
        <div
          className={styles.skillsList}
          style={{ maxHeight: "114px", overflowY: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          <ul style={{ fontSize: "16px" }}>
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <li
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill)}
                  style={{ fontSize: "16px" }}
                >
                  {skill.name}
                </li>
              ))
            ) : (
              <li>No skills available</li>
            )}
          </ul>
        </div>
      ) : (
        <div className={styles.playerInfo}>
          <div className={styles.playerName}>
            <div className={styles.playerNameDisplay}>
              <div className={styles.barraestaticadevida} />
              <button className={styles.barradinamicadevidajugadorParent}>
                <div className={styles.barradinamicadevidajugador} />
                <b className={styles.porcentajevidajugador}>100%</b>
              </button>
            </div>
            <div className={styles.nombrejugadorWrapper}>
              <b className={styles.nombrejugador}>
                {hero ? `${hero.name} lvl. 8` : 'Loading...'}
              </b>
            </div>
          </div>
          <div className={styles.enemyInfo}>
            <div className={styles.enemyName}>
              <b className={styles.nombreenemigo}>DeltaNight lvl. 8</b>
            </div>
            <div className={styles.enemyHealth}>
              <div className={styles.barraestaticadevida1} />
              <button className={styles.enemyHealthDisplay}>
                <div className={styles.barradinamicadevidaenemigo} />
                <b className={styles.porcentajevidaenemigo}>100%</b>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.gameActions}>
        <div className={styles.turnActions}>
          <div className={styles.turnIndicator}>
            <h3 className={styles.indicadordeturno}>¡Es tu turno!</h3>
          </div>
          <div className={styles.actionButtons}>
            <div className={styles.attackSkillButtons}>
              <button className={styles.botonatacar} onClick={handleAttackClick}>
                Atacar
              </button>
            </div>
            <div className={styles.attackSkillButtons1}>
              <div className={styles.botonhabilidadesParent}>
                <button
                  className={styles.botonhabilidades}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkillsClick();
                  }}
                  style={{ backgroundColor: showSkills ? "#91CB94" : "" }}
                >
                  Habilidades
                </button>
              </div>
            </div>
            <div className={styles.itemsButton}>
              <button
                className={styles.botonitems}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemsClick();
                }}
                style={{ backgroundColor: showItems ? "#91CB94" : "" }}
              >
                Items
              </button>
            </div>
            <div className={styles.powerPoints}>
              {hero && (
                <b className={styles.cantidadpuntospoder}>
                  {hero.powerPointsLeft} / {hero.powerPoints} Puntos de Poder
                </b>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlayerContainer;
