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

  const iconSize = size === "sm" ? "30px" : "37px";

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        _focus={{ outline: "black solid 2px" }}
        disabled={isDisabled}
        bg="transparent"
        size={size}
        icon={
          <Icon
            height={iconSize}
            viewBox="0 0 24 24"
            width={iconSize}
            fill="#495464"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </Icon>
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
