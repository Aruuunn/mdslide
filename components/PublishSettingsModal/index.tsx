import { FC, useState, useEffect } from "react";
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
import { isValidSlug } from "utils/isValidSlug";

export interface PublishSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishSettingsModal: FC<PublishSettingsModalProps> = (props) => {
  const { isOpen, onClose } = props;

  const store = useStore();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaved] = useState(false);
  const presentation = store.presentation;

  const [slug, setSlug] = useState(presentation?.pubmeta?.slug ?? "");
  const [error, setError] = useState(null);

  const publishedURL = `/p/${presentation?.pubmeta?.slug}`;

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

  const onSave = async () => {
    setSaved(true);

    try {
      await axios.patch(`/api/p/${presentation.id}/slug`, { slug });
      store.setPresentation({
        ...presentation,
        pubmeta: {
          ...presentation.pubmeta,
          slug,
        },
      } as Presentation);
    } catch (e) {
      // @TODO handle error

      if (typeof e?.response?.data?.message === "string") {
        setError(e?.response?.data?.message);
      }
    } finally {
      setSaved(false);
    }
  };

  useEffect(() => {
    if (slug.trim().length === 0) {
      setError("should not be empty.");
    } else if (!isValidSlug(slug)) {
      setError(
        "should contain only alphabets, numbers, - and _ . should start with a alphabet."
      );
    } else {
      setError(null);
    }
  }, [slug]);

  useEffect(() => {
    if (presentation?.pubmeta?.slug) setSlug(presentation?.pubmeta.slug);
  }, [presentation?.pubmeta?.slug]);

  if (typeof window === "undefined") return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
              You&apos;re presentation is not published. You can publish it as a
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
                value={slug}
                isInvalid={!isValidSlug(slug) || !!error}
                onChange={(e) => {
                  setSlug(e.target.value);
                }}
              />
              {error && (
                <Text color="red" fontSize="sm" mt="1">
                  * {error}
                </Text>
              )}
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
            <>
              <PrimaryButton
                mr="3"
                onClick={onSave}
                isLoading={isSaving}
                disabled={
                  error !== null ||
                  isLoading ||
                  isSaving ||
                  slug.trim() === presentation?.pubmeta?.slug
                }
              >
                Save
              </PrimaryButton>
              <Button
                bg="white"
                color="#495464"
                border="1px solid #495464"
                _hover={{ bg: "black", color: "white" }}
                isLoading={isLoading}
                disabled={isLoading}
                onClick={onUnPublish}
              >
                Un Publish
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
