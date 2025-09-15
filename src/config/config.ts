const config: any = {
  port: process.env.PORT,
  nodeEnv: "UAT", // process.env.NODE_ENV, // UAT
  jwtAccessTknSecret: process.env.ACCESS_TOKEN_SECRET_KEY,
  jwtAccessTknTm: process.env.ACCESS_TOKEN_EXPIRY_TIME,

  jwtTempTknSecret: process.env.TEMP_TOKEN_SECRET_KEY,
  jwtTempTknTm: process.env.TEMP_TOKEN_EXPIRY_TIME,

  jwtRefreshTknSecret: process.env.REFRESH_TOKEN_SECRET_KEY,
  jwtRefreshTknTm: process.env.REFRESH_TOKEN_EXPIRY_TIME,
  basicAuthUsername: process.env.BASIC_AUTH_USERNM,
  basicAuthPassword: process.env.BASIC_AUTH_PASSWORD,

  // Check Domains
  checkHospitalDomain: 'N',

  // errorLogFile path
  allowPrintErrorLog: "N",
  errorLogFilePath: 'logs/application-error.log',

  otpExpireTm: 1,


};

export default config;
