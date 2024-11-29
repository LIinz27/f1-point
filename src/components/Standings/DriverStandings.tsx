import { useState } from "react";
import { getStandingsWithTitleChance } from "../../services/getTitleChance";
import HelmetIcon from "../../svg/helmet.svg?react";
import { IDriverStanding } from "../../types/api";
import { IRaceEvent } from "../../types/app";
import { DriverPill } from "../common/DriverPill";
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
  driverStandings: IDriverStanding[];
  raceSchedule: IRaceEvent[];
  lastRound: IRaceEvent;
};

export function DriverStandings({
  driverStandings,
  raceSchedule,
  lastRound,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const fullStandings = getStandingsWithTitleChance(
    driverStandings,
    raceSchedule,
    lastRound
  );
  const shortList = fullStandings.slice(0, 3);

  const firstDriverPoints = fullStandings[0]?.points ?? 0;

  return (
    <StandingsContainer>
      <StandingsHeader onClick={() => setExpanded((prevState) => !prevState)}>
        <div style={{ display: "flex" }}>
          <IconCell size="4.4rem" offset="-1.2rem">
            <HelmetIcon />
          </IconCell>
          <div className="summary-container">
            <h2>Drivers</h2>
            {!expanded && (
              <ShortList>
                {shortList.map((standing) => (
                  <DriverPill
                    key={standing.Driver.driverId}
                    driverCode={standing.Driver.code}
                    position={standing.position}
                  />
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
              <th>Driver</th>
              <th>Points</th>
              <th>Difference</th>
              <th>Wins</th>
            </tr>
          </thead>

          <tbody>
            {fullStandings.map((standing) => {
              const pointDifference = firstDriverPoints - standing.points;
              return (
                <tr key={standing.Driver.driverId}>
                  <td>
                    <TitleTrophy standing={standing} />
                  </td>
                  <td>{standing.position}</td>
                  <td>
                    {standing.Driver.givenName} {standing.Driver.familyName}
                    <span
                      className={`flag-icon flag-icon-${nationalityToFlagCode[
                        standing.Driver.nationality
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
