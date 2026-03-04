export const blurOthers = (selector: string) => {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  elements.forEach((element) => {
    element.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
    element.style.filter = 'blur(2px)';
    element.style.opacity = '0.5';
  });
};

export const unBlur = (selector: string) => {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  elements.forEach((element) => {
    element.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
    element.style.filter = 'blur(0px)';
    element.style.opacity = '1';
  });
};
