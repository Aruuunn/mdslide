import { FC } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  Avatar,
  IconButton,
  MenuList,
  MenuButtonProps,
  Icon,
  IconButtonProps,
} from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0";

export type AccountOptionsProps = {
  size: "sm" | "md";
  isDisabled?: boolean;
} & MenuButtonProps &
  IconButtonProps;

export const AccountOptions: FC<AccountOptionsProps> = (props) => {
  const { isDisabled, size, ...rest } = props;
  const { user } = useUser();

  const iconSize = size === "sm" ? "27px" : "37px";

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        _focus={{ outline: "black solid 2px" }}
        disabled={isDisabled}
        bg="transparent"
        size={size}
        icon={
          <Avatar
            width={iconSize}
            name={user?.name}
            height={iconSize}
            src={user?.picture}
          />
        }
        {...rest}
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
