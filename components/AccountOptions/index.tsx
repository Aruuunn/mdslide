import { FC } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  Avatar,
  IconButton,
  MenuList,
} from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0";

export interface AccountOptionsProps {
  size: "sm" | "md";
  isDisabled?: boolean;
}

export const AccountOptions: FC<AccountOptionsProps> = (props) => {
  const { size, isDisabled } = props;
  const { user } = useUser();

  const avatarSize = size === "sm" ? "28px" : "37px";

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        _focus={{ outline: "black solid 2px" }}
        isRound
        disabled={isDisabled}
        bg="transparent"
        ml="25px"
        size={size}
        icon={
          <Avatar
            height={avatarSize}
            width={avatarSize}
            name={user?.name ?? ""}
            src={user?.picture ?? ""}
          />
        }
      >
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem as={"a"} href="/api/auth/logout">
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
