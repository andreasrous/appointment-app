import { getAllBusinesses } from "@/data/business";
import { BusinessesView } from "@/components/business/businesses-view";

const SearchPage = async () => {
  const businesses = await getAllBusinesses();

  return (
    <div className="h-full p-4 sm:p-16">
      <BusinessesView businesses={businesses} />
    </div>
  );
};

export default SearchPage;
