import { assign, Machine } from "xstate";

interface LightContext {
  elapsed: number;
  interval: number;
  light: string;
  outage: boolean;
}

type LightEvent =
  | {
      type: "CHANGE";
    }
  | { type: "OUTAGE"; value: boolean };

interface LightStateSchema {
  states: {
    green: {};
    yellow: {};
    red: {};
    redblink: {};
    hist: {};
  };
}

export const lightMachine = Machine<LightContext, LightStateSchema, LightEvent>(
  {
    //Machine Identifier
    id: "light",

    //Initial state
    initial: "green",

    //local context for entire machine
    context: {
      elapsed: 0,
      interval: 5,
      light: "green",
      outage: false
    },

    //State definitions
    states: {
      green: {
        invoke: {
          src: context => cb => {
            const interval = setInterval(() => {
              cb("CHANGE");
            }, 4000 * context.interval);

            return () => {
              clearInterval(interval);
            };
          }
        },
        on: {
          CHANGE: {
            target: "yellow",
            actions: assign<LightContext>({
              elapsed: ctx => 0,
              light: "yellow"
            })
          },
          OUTAGE: {
            target: "redblink",
            actions: assign<LightContext>({
              outage: ctx => true,
              light: "redblink"
            })
          }
        }
      },
      yellow: {
        invoke: {
          src: context => cb => {
            const interval = setInterval(() => {
              cb("CHANGE");
            }, 1000 * context.interval);

            return () => {
              clearInterval(interval);
            };
          }
        },
        on: {
          CHANGE: {
            target: "red",
            actions: assign<LightContext>({ elapsed: ctx => 0, light: "red" })
          },
          OUTAGE: {
            target: "redblink",
            actions: assign<LightContext>({
              outage: ctx => true,
              light: "redblink"
            })
          }
        }
      },
      red: {
        invoke: {
          src: context => cb => {
            const interval = setInterval(() => {
              cb("CHANGE");
            }, 4000 * context.interval);

            return () => {
              clearInterval(interval);
            };
          }
        },
        on: {
          CHANGE: {
            target: "green",
            actions: assign<LightContext>({ elapsed: ctx => 0, light: "green" })
          },
          OUTAGE: {
            target: "redblink",
            actions: assign<LightContext>({
              outage: ctx => true,
              light: "redblink"
            })
          }
        }
      },
      redblink: {
        on: {
          OUTAGE: {
            target: "red",
            actions: assign<LightContext>({
              outage: ctx => false,
              light: "red"
            })
          }
        }
      },
      hist: {
        type: "history",
        history: "deep"
      }
    },
    on: {
      OUTAGE: {
        actions: assign<LightContext>({
          outage: ctx => false,
          light: "state.hist"
        })
      }
    }
  },
  {
    actions: {
      //action implementation
    },
    activities: {
      /* */
    },
    guards: {
      /* */
    },
    services: {
      /* */
    }
  }
);
