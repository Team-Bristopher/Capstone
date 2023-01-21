import { FunctionComponent } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./home/home";
import { NotFound } from "./notfound/notfound";
import { Settings } from "./settings/settings";

export const App: FunctionComponent = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="*" element={<NotFound />} />

        <Route path="settings" element={<Settings />} />
      </Routes>
    </>
  );
}
