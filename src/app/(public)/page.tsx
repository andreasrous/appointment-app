import * as motion from "motion/react-client";

import { Hero } from "./_components/hero";
import { Preview } from "./_components/preview";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Hero />
      <Preview />
    </motion.div>
  );
}
