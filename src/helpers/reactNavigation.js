export const calculateTabWidth = (windowWidth) => {
  let tabWidth = 80;
  let tabCount = 6;
  if (tabWidth * tabCount > windowWidth) {
    let tabsPerWindow1 = windowWidth / 80;
    let tabsPerWindow2 = Math.round(tabsPerWindow1);
    tabCount = tabsPerWindow2 - 0.5;
    tabWidth = windowWidth / tabCount;
  }
  return tabWidth;
};
