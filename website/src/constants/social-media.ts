import InstagramIcon from "@/components/icons/instagram.astro";
import LinkedinIcon from "@/components/icons/linkedin.astro";
import TwitterIcon from "@/components/icons/twitter.astro";
import GithubIcon from "@/components/icons/github.astro";

export const SOCIAL_MEDIA = {
  github: {
    icon: GithubIcon,
    link: "https://github.com/AleksaC",
  },
  twitter: {
    icon: TwitterIcon,
    link: "https://twitter.com/Aleksa_C_",
  },
  instagram: {
    icon: InstagramIcon,
    link: "https://www.instagram.com/__aleksa_c/",
  },
  linkedin: {
    icon: LinkedinIcon,
    link: "https://www.linkedin.com/in/aleksa-cukovic/",
  },
} as const;
