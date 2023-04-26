import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateFundraiser } from "./create-fundraiser/create_fundraiser";
import { DonationPayment } from "./donation-payment/donation_payment";
import { EditFundraiser } from "./edit-fundraiser/edit_fundraiser";
import { ForgotPassword } from "./forgot-password/forgot_password";
import { FundraiserDetail } from "./fundraiser-detail/fundraiser_detail";
import { Home } from "./home/home";
import { Login } from "./login/login";
import { NewPassword } from "./new-password/new_password";
import { NotFound } from "./notfound/notfound";
import { Recovery } from "./recovery/recovery";
import { RegisterPage } from "./register/register";
import { Settings } from "./settings/settings";
import { SettingsEdit } from "./settings/settings-edit";
import { AccessibilityStatement } from "./statement-pages/accessibility-statement";
import { PrivacyPolicy } from "./statement-pages/privacy-policy";
import { TermsOfUse } from "./statement-pages/terms-of-use";

export const App: FunctionComponent = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />

        <Route path="fundraiser/:fundraiserID" element={<FundraiserDetail />} />
        <Route path="fundraiser/create" element={<CreateFundraiser />} />
        <Route path="fundraiser/donate/payment" element={<DonationPayment />} />
        <Route path="fundraiser/edit/:fundraiserID" element={<EditFundraiser />} />

        <Route path="settings" element={<Settings />} />
        <Route path="settings/edit" element={<SettingsEdit />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="recovery" element={<Recovery />} />
        <Route path="new-password" element={<NewPassword />} />

        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="accessibility-statement" element={<AccessibilityStatement />} />
        <Route path="terms-of-use" element={<TermsOfUse />} />
      </Routes>
    </>
  );
};
