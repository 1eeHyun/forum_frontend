import { ROUTES } from "@/constants/routes";

const handleProfileClick = () => {
  if (user.username) {
    navigate(ROUTES.PROFILE.replace(":username", user.username));
  }
};
