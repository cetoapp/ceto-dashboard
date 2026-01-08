import {
  ar,
  enUS,
  fr,
} from "date-fns/locale"
import { Language } from "./types"

export const languages: Language[] = [
  {
    code: "en",
    display_name: "English",
    ltr: true,
    date_locale: enUS,
  },
  {
    code: "fr",
    display_name: "Français",
    ltr: true,
    date_locale: fr,
  },
  {
    code: "ar",
    display_name: "العربية",
    ltr: true,
    date_locale: ar,
  }
]
