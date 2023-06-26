import { FC } from "react";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useCheckIsAuth } from "./hooks";

const LoadingAppPage: FC = () => {
    useCheckIsAuth();

    return (
        <LoadingSpinner/>
    );
};

export { LoadingAppPage };
