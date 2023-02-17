import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./home/home";
import { Login } from "./login/login";
import { NotFound } from "./notfound/notfound";
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

        <Route path="settings" element={<Settings />} />
        <Route path="settings/edit" element={<SettingsEdit />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="accessibility-statement" element={<AccessibilityStatement />} />
        <Route path="terms-of-use" element={<TermsOfUse />} />
      </Routes>
    </>
  );
};
