import axios from "axios";
import { debounce } from "debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import {
  Input,
  Flex,
  Spacer,
  Spinner,
  Tooltip,
  Icon,
  IconButton,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";

import Logo from "components/Logo";
import AccountActions from "components/AccountActions";
import PublishSettingsModal from "components/PublishSettingsModal";
import { useStore } from "lib/stores/EditorPage";

export interface EditorNavbarProps {
  title: string;
  pid: string;
}

export const EditorNavbar: FC<EditorNavbarProps> = (props) => {
  const { title: initialTitle, pid } = props;

  const isSaving = useStore((state) => state.isSaving);
  const startPresentationMode = useStore(
    (store) => store.startPresentationMode
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [title, setTitle] = useState(initialTitle);

  const updateRemote = debounce(async (newTitle: string) => {
    // TODO handle error.
    await axios.patch(`/api/p/${pid}/title`, { title: newTitle });
  }, 500);

  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle);

    await updateRemote(newTitle.trim() || "Untitled");
  };

  return (
    <>
      <PublishSettingsModal isOpen={isOpen} onClose={onClose} />
      <Flex
        as="nav"
        p="20px"
        boxShadow="xl"
        width="100%"
        height="70px"
        alignItems="center"
        borderWidth="1px"
        borderColor="#e2e8f0"
      >
        <Link href="/">
          <Logo fontSize="xl" />
        </Link>
        <Spacer />

        <Input
          maxWidth="400px"
          textAlign="center"
          value={title}
          required
          isInvalid={title?.trim() === ""}
          focusBorderColor="black"
          onChange={(e) => updateTitle(e.target.value)}
        />

        <Spacer />

        {isSaving ? (
          <Tooltip label="saving.." aria-label="saving the changes">
            <Spinner
              emptyColor="gray.200"
              color="gray.400"
              width="25px"
              height="25px"
            />
          </Tooltip>
        ) : (
          <Tooltip label="saved" aria-label="saved to cloud">
            <Icon
              viewBox="0 0 24 24"
              width="34px"
              color="gray.300"
              height="34px"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
                fill="currentColor"
              />
            </Icon>
          </Tooltip>
        )}

        <Divider orientation="vertical" ml="20px" />

        <Tooltip label="Start Presenting" aria-label="Start Presenting">
          <IconButton
            ml="20px"
            aria-label="present"
            onClick={startPresentationMode}
            bg="transparent"
            size="sm"
            icon={
              <Icon
                height="30px"
                viewBox="0 0 24 24"
                width="30px"
                fill="gray.500"
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                  <path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.11,3,19,3z M19,19H5V7h14V19z M13.5,13 c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5S13.5,12.17,13.5,13z M12,9c-2.73,0-5.06,1.66-6,4 c0.94,2.34,3.27,4,6,4s5.06-1.66,6-4C17.06,10.66,14.73,9,12,9z M12,15.5c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 c1.38,0,2.5,1.12,2.5,2.5C14.5,14.38,13.38,15.5,12,15.5z" />
                </g>
              </Icon>
            }
          />
        </Tooltip>

        <Tooltip label="Publish Settings">
          <IconButton
            bg="transparent"
            aria-label=""
            onClick={onOpen}
            size="sm"
            ml="20px"
            icon={
              <Icon
                height="30px"
                viewBox="0 0 24 24"
                width="30px"
                fill="gray.500"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </Icon>
            }
          />
        </Tooltip>

        <AccountActions aria-label="account options" ml="20px" size="sm" />
      </Flex>
    </>
  );
};

export default EditorNavbar;
