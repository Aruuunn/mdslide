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
  Input,
  Button,
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

  const onUnPublish = async () => {
    setLoading(true);

    try {
      await axios.post(`/api/p/${presentation.id}/unpublish`);

      store.setPresentation({
        ...presentation,
        isPublished: false,
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#495464">Publish Settings</ModalHeader>
        <ModalCloseButton />
        <Text
          bg="#fafafa"
          pt="5"
          pb="5"
          pl="6"
          borderWidth="1px"
          borderColor="#e2e8f0"
          width="100%"
          color="#495464"
        >
          {presentation.isPublished ? (
            <>
              Your Presentation is publised at{" "}
              <Box as="a" target="_blank" href={publishedURL}>
                <strong>{window.location.origin + publishedURL}</strong>
              </Box>
            </>
          ) : (
            <>
              {" "}
              You're presentation is not published. You can publish it as a
              webpage.{" "}
            </>
          )}
        </Text>
        <ModalBody mt="4">
          {presentation.isPublished ? (
            <>
              <Text
                as="label"
                htmlFor="slug"
                fontSize="xs"
                color="#495464"
                style={{ letterSpacing: "0.15em" }}
                fontWeight="bold"
              >
                SLUG
              </Text>

              <Input
                focusBorderColor="black"
                placeholder="slug"
                mt="2"
                id="slug"
                value={presentation.pubmeta?.slug}
              />
            </>
          ) : null}
        </ModalBody>

        <ModalFooter>
          {!presentation.isPublished ? (
            <PrimaryButton
              onClick={onPublish}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Publish Now
            </PrimaryButton>
          ) : (
            <Button
              color="#495464"
              isLoading={isLoading}
              disabled={isLoading}
              onClick={onUnPublish}
            >
              Un Publish
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
