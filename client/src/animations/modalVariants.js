export const modalVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      mass: 1,
      delay: 0.1,
    },
  },
  exit: { opacity: 0, scale: 0 },
};
