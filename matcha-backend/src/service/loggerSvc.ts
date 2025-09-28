import pino from "pino";

const LOG_DIR = "./logs/app.log";

// log to both file and console
const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      // options: { destination: `${__dirname}/app.log` },
      options: { destination: LOG_DIR },
    },
    {
      target: "pino-pretty", // logs to the standard output by default
    },
  ],
});

// log only to console. Similar to console.log
const ctransport = pino.transport({
  targets: [
    {
      target: "pino-pretty", // logs to the standard output by default
    },
  ],
});

// log only to file
const ftransport = pino.transport({
  targets: [
    {
      target: "pino/file",
      // options: { destination: `${__dirname}/app.log` },
      options: { destination: LOG_DIR },
    },
  ],
});

// jegoh: manual remove default to pass build, dont think will break anything, wanted to just use direct dockerfile dockercompose.
// use transport for logging to both file and console
export const logger = pino(
  {
    level: "info",
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  },
  transport
);

// use transport for logging to console only
export const clogger = pino(
  {
    level: "info",
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  },
  ctransport
);

// use transport for logging to file only
export const flogger = pino(
  {
    level: "info",
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  },
  ftransport
);
