import * as React from "react";
import { Solution } from "../models/solver";

export function Solutions({
  solutions,
  apply,
}: {
  solutions: Solution[];
  apply: (solutions: Solution[]) => void;
}) {
  return (
    <div className="solutions">
      <details className="table-wrapper">
        <summary>Solutions</summary>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Action</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map(([position, action], i) => (
              <tr key={i}>
                <td>[{position.join(", ")}]</td>
                <td>{action}</td>
                <td>
                  <button onClick={() => apply([[position, action]])}>
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <button onClick={() => apply(solutions)}>Apply All</button>
    </div>
  );
}
