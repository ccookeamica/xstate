import React from "react";
import { useMachine } from "@xstate/react";
import { lightMachine } from "./TrafficMachine";
import "./App.css";

function App() {
  const [state, send] = useMachine(lightMachine);

  return (
    <div className="App">
      <header className="App-header">
        <output className="lightBox">
          <div
            className={
              (state.context.light !== "green" && "off") + " light green"
            }
          ></div>
          <div
            className={
              (state.context.light !== "yellow" && "off") + " light yellow"
            }
          ></div>
          <div
            className={
              (state.context.light === "red"
                ? "red"
                : state.context.light === "redblink"
                ? "redblink"
                : "off") + " light"
            }
          ></div>
        </output>
        <div className="buttonBox">
          <button
            disabled={!!state.context.outage}
            onClick={() => send("CHANGE")}
          >
            Change Light
          </button>
          <button disabled={state.context.light !== "red"}>Toggle Walk</button>
          <button
            onClick={() => send("OUTAGE", { value: !state.context.outage })}
          >
            Toggle Outage
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
