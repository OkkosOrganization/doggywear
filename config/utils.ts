import { gsap } from 'gsap';

export const blurOthers = (selector: string) => {
  gsap.to(selector, { filter: 'blur(2px)', autoAlpha: 0.5, duration: 0.3 });
};

export const unBlur = (selector: string) => {
  gsap.to(selector, { filter: 'blur(0px)', autoAlpha: 1, duration: 0.3 });
};
