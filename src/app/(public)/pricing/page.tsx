"use client";

import { UpgradeButton } from "@/components/billing/upgrade-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe";
import { useCurrentUser } from "@/hooks/use-current-user";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";

const PricingPage = () => {
  const user = useCurrentUser();

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For individuals booking appointments.",
      quota: PLANS.find((p) => p.slug === "free")!.quota,
      features: [
        {
          text: "Book & manage appointments",
          footnote: "Search, book and cancel appointments with businesses.",
        },
        {
          text: "Calendar sync",
          footnote: "Google/Microsoft calendar integration with notifications.",
        },
        {
          text: "Business messaging",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Business features",
          footnote: "Dashboard, payments, and analytics",
          negative: true,
        },
      ],
    },
    {
      plan: "Pro",
      tagline: "For businesses managing appointments.",
      quota: PLANS.find((p) => p.slug === "pro")!.quota,
      features: [
        {
          text: "Full business management",
          footnote: "Receive appointments, set working hours & services.",
        },
        {
          text: "Team & employee system",
        },
        {
          text: "Payment processing",
        },
        {
          text: "Advanced analytics",
        },
        {
          text: "Mobile-friendly interface",
        },
      ],
    },
  ];

  return (
    <motion.div
      className="my-16 sm:my-24 text-center max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto mb-16 px-4 sm:mb-20 sm:max-w-lg">
        <h1 className="text-4xl sm:text-5xl font-bold">Pricing</h1>
        <p className="mt-5 text-gray-600 sm:text-lg">
          Simple pricing for individuals and businesses. Start free, upgrade
          when you need more.
        </p>
      </div>

      <div className="px-4 sm:px-0 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <TooltipProvider>
          {pricingItems.map(({ plan, tagline, features }) => {
            const price =
              PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount ||
              0;

            return (
              <div
                key={plan}
                className={cn("relative rounded-2xl bg-white shadow-lg", {
                  "border-2 border-purple-600 shadow-purple-200":
                    plan === "Pro",
                  "border border-gray-200": plan !== "Pro",
                })}
              >
                {plan === "Pro" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-2 text-sm font-medium text-white">
                    Upgrade now
                  </div>
                )}

                <div className="p-5">
                  <h3 className="my-3 text-center font-display text-3xl font-bold">
                    {plan}
                  </h3>
                  <p className="text-gray-500">{tagline}</p>
                  <p className="my-5 font-display text-6xl font-semibold">
                    {price}€
                  </p>
                  <p className="text-gray-500">per month</p>
                </div>

                <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>Unlimited appointments/mo included</p>

                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="cursor-default ml-1.5">
                        <HelpCircle className="h-4 w-4 text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2">
                        Number of appointments you can manage each month.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <ul className="my-10 space-y-5 px-8">
                  {features.map(({ text, footnote, negative }) => (
                    <li key={text} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {negative ? (
                          <Minus className="h-6 w-6 text-gray-300" />
                        ) : (
                          <Check className="h-6 w-6 text-purple-500" />
                        )}
                      </div>
                      {footnote ? (
                        <div className="flex items-center space-x-1">
                          <p
                            className={cn("text-gray-600", {
                              "text-gray-400": negative,
                            })}
                          >
                            {text}
                          </p>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="cursor-default ml-1.5">
                              <HelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <p
                          className={cn("text-gray-600", {
                            "text-gray-400": negative,
                          })}
                        >
                          {text}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200" />
                <div className="p-5">
                  {plan === "Free" ? (
                    <Link
                      href={user ? "/dashboard" : "/auth/signup"}
                      className={buttonVariants({
                        className: "w-full",
                        variant: "secondary",
                      })}
                    >
                      {user ? "Upgrade now" : "Sign up"}
                      <ArrowRight className="h-5 w-5 ml-1.5" />
                    </Link>
                  ) : user ? (
                    <UpgradeButton />
                  ) : (
                    <Link
                      href="/auth/signup"
                      className={buttonVariants({
                        className: "w-full",
                      })}
                    >
                      {user ? "Upgrade now" : "Sign up"}
                      <ArrowRight className="h-5 w-5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default PricingPage;
