import { FC, useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  ModalContent,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";
import { PrimaryButton } from "components/PrimayButton";
import { useStore } from "lib/stores/EditorPage";
import { Presentation } from "model/interfaces/presentation";

export interface PublishOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishOptionsModal: FC<PublishOptionsModalProps> = (props) => {
  const { isOpen, onClose } = props;

  const store = useStore();
  const [isLoading, setLoading] = useState(false);

  const presentation = store.presentation;
  const publishedURL = `/p/${presentation.pubmeta?.slug}`;

  const onPublish = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(`/api/p/${presentation.id}/publish`);

      const { pubmeta } = data;

      store.setPresentation({
        ...presentation,
        pubmeta,
        isPublished: true,
      } as Presentation);
    } catch (e) {
      // @TODO handle error

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (typeof window === "undefined") return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Publish Settings</ModalHeader>
        <ModalCloseButton />
        <Text
          bg="#fafafa"
          pt="5"
          pb="5"
          pl="6"
          borderWidth="1px"
          borderColor="#e2e8f0"
          width="100%"
        >
          {presentation.isPublished ? (
            <>
              Your Presentation is publised at{" "}
              <Box as="a" target="_blank" href={publishedURL}>
                <strong>{window.location.origin + publishedURL}</strong>
              </Box>
            </>
          ) : (
            "You can publish your presentation as a webpage."
          )}
        </Text>
        <ModalBody></ModalBody>

        <ModalFooter>
          {!presentation.isPublished ? (
            <PrimaryButton
              onClick={onPublish}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Publish
            </PrimaryButton>
          ) : null}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
