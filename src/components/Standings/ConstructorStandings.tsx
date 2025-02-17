import { useState } from "react";

import { getStandingsWithTitleChance } from "../../services/getTitleChance";
import FormulaCarIcon from "../../svg/formula_car.svg?react";
import { IConstructorStanding } from "../../types/api";
import { IRaceEvent } from "../../types/app";
import { ConstructorPill } from "./ConstructorPill";
import nationalityToFlagCode from "../common/nationalityToFlagCode";
import {
  Chevron,
  IconCell,
  ResultsTable,
  ShortList,
  StandingsContainer,
  StandingsHeader,
} from "./StandingsSection";
import { TitleTrophy } from "./TitleTrophy";
import 'flag-icon-css/css/flag-icons.min.css';

type Props = {
  constructorStandings: IConstructorStanding[];
  raceSchedule: IRaceEvent[];
  lastRound: IRaceEvent;
};

export function ConstructorStandings({
  constructorStandings,
  raceSchedule,
  lastRound,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const fullStandings = getStandingsWithTitleChance(
    constructorStandings,
    raceSchedule,
    lastRound,
  );
  const shortList = fullStandings.slice(0, 3);
  const firstConstructorPoints = fullStandings[0]?.points ?? 0;


  return (
    <StandingsContainer>
      <StandingsHeader onClick={() => setExpanded((prevState) => !prevState)}>
        <div style={{ display: "flex" }}>
          <IconCell size="4.4rem" scale="1.3" offset="0.6rem" rotate="36deg">
            <FormulaCarIcon />
          </IconCell>
          <div className="summary-container">
            <h2>Constructors</h2>
            {!expanded && (
              <ShortList>
                {shortList.map((standing) => (
                  <ConstructorPill
                    key={standing.Constructor.constructorId}
                    constructorStanding={standing}
                  ></ConstructorPill>
                ))}
              </ShortList>
            )}
          </div>
        </div>

        <Chevron expanded={expanded} />
      </StandingsHeader>

      {expanded && (
        <ResultsTable>
          <thead>
            <tr>
              <th />
              <th>P</th>
              <th>Constructor</th>
              <th>Points</th>
              <th>Difference</th>
              <th>Wins</th>
            </tr>
          </thead>

          <tbody>
            {fullStandings.map((standing) => {
            const pointDifference = firstConstructorPoints - standing.points;
            return (
              <tr key={standing.Constructor.constructorId}>
                <td>
                  <TitleTrophy standing={standing} />
                </td>
                <td>{standing.position}</td>
                <td>{standing.Constructor.name}
                  <span
                    className={`flag-icon flag-icon-${nationalityToFlagCode[
                      standing.Constructor.nationality
                    ] ?? "xx"}`}
                    style={{ marginLeft: "8px" }}
                  />
                </td>
                <td>{standing.points}</td>
                <td>{pointDifference === 0 ? "-" : `+${pointDifference}`}</td>
                <td>{standing.wins > 0 && standing.wins}</td>
              </tr>
             );

              })}
          </tbody>
        </ResultsTable>
      )}
    </StandingsContainer>
  );
}
