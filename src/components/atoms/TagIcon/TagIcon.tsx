import FishIcon from "@src/components/atoms/FishIcon";
import VeganIcon from "@src/components/atoms/VeganIcon";
import { TAG } from "@src/utils/constants.ts";

type TagIconProps = {
  tag: (typeof TAG)[keyof typeof TAG];
};

function TagIcon({ tag }: TagIconProps) {
  if (tag === TAG.fish) return <FishIcon />;
  if (tag === TAG.vegan) return <VeganIcon />;
  return null;
}

export default TagIcon;
