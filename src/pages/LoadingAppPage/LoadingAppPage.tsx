import { FC, useEffect, useState } from "react";
import { LoadingSpinner } from "@deskpro/app-sdk";
// import { useCheckIsAuth } from "./hooks";
import { Button } from "@deskpro/deskpro-ui";

const LoadingAppPage: FC = () => {
    // useCheckIsAuth();
    const [errorState, setErrorState] = useState<string | null>(null)

    useEffect(() => {
        if (errorState === "left") {
            throw new Error("hello from Trello")
        }

        if (errorState === "right") {
            throw "HI from Trello"
        }
    }, [errorState])

    return (
        <>
            <Button
                text="Left Error"
                onClick={() => { setErrorState("left") }}
            />
            <Button
                text="Right Error"
                onClick={() => { setErrorState("right") }}
            />
            <LoadingSpinner />
        </>
    );
};

export { LoadingAppPage };
