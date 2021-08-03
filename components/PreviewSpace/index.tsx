import {FC} from "react";
import { Box } from "@chakra-ui/react"

export interface PreviewSpaceProps {}

export const PreviewSpace: FC<PreviewSpaceProps> = (props) => {

    return (
        <Box p="20px" width="100%" height="100%"  bg="green">
            Preview Space
        </Box>
    )
}
