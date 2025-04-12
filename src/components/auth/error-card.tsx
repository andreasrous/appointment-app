import { CardWrapper } from "@/components/auth/card-wrapper";
import { BsExclamationCircleFill } from "react-icons/bs";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong."
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showBackButton
    >
      <div className="w-full flex justify-center items-center">
        <BsExclamationCircleFill className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
