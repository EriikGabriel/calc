type ThemeType = {
  name: "White" | "Dark";

  pageBgColor: string;
  primaryBgColor: string;
  secondaryBgColor: string;

  accentColor: string;
  negativeColor: string;

  primaryTextColor: string;
  secondaryTextColor: string;
};

const buttonToggle = document.getElementById("toggle-button") as HTMLInputElement;

const getStyle = (element: HTMLElement, style: string) => window.getComputedStyle(element).getPropertyValue(style);

const whiteTheme: ThemeType = {
  name: "White",

  pageBgColor: getStyle(document.body, "--page-bg-color"),
  primaryBgColor: getStyle(document.body, "--primary-bg-color"),
  secondaryBgColor: getStyle(document.body, "--secondary-bg-color"),

  accentColor: getStyle(document.body, "--accent-color"),
  negativeColor: getStyle(document.body, "--negative-color"),

  primaryTextColor: getStyle(document.body, "--primary-text-color"),
  secondaryTextColor: getStyle(document.body, "--secondary-text-color"),
};

const darkTheme: ThemeType = {
  name: "Dark",

  pageBgColor: "#2d2d2d",
  primaryBgColor: "#0a2339",
  secondaryBgColor: "#0d2343",

  accentColor: getStyle(document.body, "--accent-color"),
  negativeColor: getStyle(document.body, "--negative-color"),

  primaryTextColor: "#ffffff",
  secondaryTextColor: "#9da6b0",
};

const storageTheme = localStorage.getItem("@calc:theme");
const activeTheme: ThemeType = storageTheme ? JSON.parse(storageTheme) : whiteTheme;

const transformKey = (key: string) => "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase();

const getPersistedTheme = () => {
  Object.keys(activeTheme).map((key) => {
    document.body.style.setProperty(transformKey(key), activeTheme[key as keyof typeof activeTheme]);
  });
};

const toggleTheme = () => {
  const storageTheme = localStorage.getItem("@calc:theme");
  const activeTheme: ThemeType = storageTheme ? JSON.parse(storageTheme) : whiteTheme;

  const toggledTheme: ThemeType = activeTheme.name === "White" ? darkTheme : whiteTheme;

  Object.keys(toggledTheme).map((key) => {
    document.body.style.setProperty(transformKey(key), toggledTheme[key as keyof typeof toggledTheme]);
  });

  // buttonToggle.innerText = "Mudar para o tema " + activeTheme.name;

  localStorage.setItem("@calc:theme", JSON.stringify(toggledTheme));
};

buttonToggle.addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", getPersistedTheme);
