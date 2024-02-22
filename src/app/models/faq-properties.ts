import { PoPopupAction } from "@po-ui/ng-components";
import { FaqQuestionsSections } from "./faq-questions-sections";
import { MoreInformations } from "./more-informations";

export interface FaqProperties {
  title: string;
  summary: string;
  questions: Array<FaqQuestionsSections>;
  buttonPopUp: Array<PoPopupAction>;
  moreInformations?: MoreInformations;
}