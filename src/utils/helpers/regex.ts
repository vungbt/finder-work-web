const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const REGEX_NUMBER = /^\+?([1-9]\d*)$/;

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;

//eslint-disable-next-line
const REGEX_PHONE = /^[0-9\+]{10,12}$/;

const REGEX_USERNAME = /^[A-Za-z0-9_]+$/;

function isEmail(input: string) {
  const re = new RegExp(REGEX_EMAIL);
  return re.test(input);
}

function isNumber(input: string) {
  const re = new RegExp(REGEX_NUMBER);
  return re.test(input);
}

function isPassword(input: string) {
  const re = new RegExp(REGEX_PASSWORD);
  return re.test(input);
}

//eslint-disable-next-line
function isPhone(input: string) {
  const re = new RegExp(REGEX_PHONE);
  return re.test(input);
}

function isUsername(input: string) {
  const re = new RegExp(REGEX_USERNAME);
  return re.test(input);
}

export const RegexHelper = {
  REGEX_EMAIL,
  REGEX_NUMBER,
  REGEX_PASSWORD,
  REGEX_PHONE,
  REGEX_USERNAME,
  isEmail,
  isNumber,
  isPassword,
  isPhone,
  isUsername
};
