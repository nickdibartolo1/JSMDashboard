import { Avatar as AntdAvatar, AvatarProps } from "antd";

type Props = AvatarProps & {
  name?: string;
};

const CustomAvatar = ({ name, style, ...rest }: Props) => {
  return (
    <AntdAvatar
      alt={"Nick DiBartolo"}
      size="small"
      style={{
        backgroundColor: "#93e074",
        display: "flex",
        alignItems: "center",
        border: "none",
        ...style
      }}
      {...rest}
    >
      {name}
    </AntdAvatar>
  );
};

export default CustomAvatar;
