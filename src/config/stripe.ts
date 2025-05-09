export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    features: {
      calendars: 1,
      integrations: true,
      favorites: true,
      messaging: true,
    },
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 100,
    features: {
      businessRegistration: true,
      employeeManagement: true,
      serviceManagement: true,
      workingHours: true,
      analytics: true,
      payments: true,
      calendars: 5,
      integrations: true,
    },
    price: {
      amount: 49,
      priceIds: {
        test: "price_1RMndI3kSLfXaj5lqQDxpXoa",
        production: "",
      },
    },
  },
];
