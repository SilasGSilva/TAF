import { FaqQuestionsSections } from "../../models/faq-questions-sections";
import { FaqProperties } from "../../models/faq-properties";

export interface IFaqModal {
  faqModal: FaqProperties;

  openModalFAQ: () => void;
  getFaqQuestionsSections: () => Array<FaqQuestionsSections>;
}