import { FC, useEffect, useState } from "react";
import { Center, Text } from "@chakra-ui/react";
import Typewriter from 'typewriter-effect/dist/core';

const LandingPage: FC<{}> = () => {
    const [completedTyping, setCompletedTyping] = useState(false);

    useEffect(() => {
        const typewriter = new Typewriter("#title", {
            delay: 150,
        });

        typewriter.typeString("# **MD**SLIDE ").pauseFor(400).callFunction(() => {
            setCompletedTyping(true);
        }).start();
    } , [])

    return <>
        <Center height="100vh">
            {!completedTyping ? <Text fontSize="xl"><div id="title">
                </div></Text>:  <Text fontSize="5xl"><strong>MD</strong>SLIDE</Text>}
        </Center>
    </>
}



export default LandingPage;
