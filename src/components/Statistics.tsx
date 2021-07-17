import * as React from "react";
import { Level } from "../constants";
import { Statistics } from "../hooks/useStatistics";
import { formatTime } from "../utils";

export function Statistics({ statistics }: { statistics: Statistics }) {
  return (
    <div className="statistics">
      <details>
        <summary>Statistics</summary>
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Total</th>
              <th>Wins</th>
              <th>Records 1st</th>
              <th>Records 2nd</th>
              <th>Records 3rd</th>
            </tr>
          </thead>
          <tbody>
            {(["easy", "medium", "hard"] as Level[]).map((level) => (
              <tr key={level}>
                <td>{level}</td>
                <td>{statistics[level].total}</td>
                <td>{statistics[level].wins}</td>
                {statistics[level].records.map((record, i) => (
                  <td key={i}>{record && formatTime(record)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
