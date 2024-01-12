export const calendarVariants = (direction) => ({
  hidden: { opacity: 0, x: direction === 0 ? 1000 : -1000 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween",
      ease: "anticipate",
      duration: 0.2,
    },
  },
  exit: { opacity: 0 },
});
