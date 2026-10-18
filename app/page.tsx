import { homeMarkup } from "@/app/home-markup";
import { homeStyles } from "@/app/home-styles";
import { HomeExperience } from "@/app/components/home-experience";
export default function HomePage() {
 return <><style>{homeStyles}</style><a className="skip-link" href="#main-content">Skip to content</a><HomeExperience markup={homeMarkup}/></>;
}
