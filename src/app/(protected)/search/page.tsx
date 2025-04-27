import * as motion from "motion/react-client";

import { getAllBusinesses } from "@/data/business";
import { BusinessesView } from "@/components/business/businesses-view";

const SearchPage = async () => {
  const businesses = await getAllBusinesses();

  return (
    <motion.div
      className="h-full p-4 sm:p-16"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <BusinessesView businesses={businesses} />
    </motion.div>
  );
};

export default SearchPage;
