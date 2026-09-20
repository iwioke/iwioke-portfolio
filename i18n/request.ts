import {getRequestConfig} from "next-intl/server";
import {content, defaultLocale, isLocale} from "@/content";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: content[locale],
  };
});
