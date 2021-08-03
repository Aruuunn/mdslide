import {FC} from "react";
import { Box } from "@chakra-ui/react"

export interface EditorPanelProps {}

export const EditorPanel: FC<EditorPanelProps> = (props) => {

    return (
            <Box p="20px" width="100%" height="100%"  bg="blue">
                Editor Panel
            </Box>
    )
}
