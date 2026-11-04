import type {RouteObject} from 'react-router'

import App from "./App";
import LibraryPage from "./pages/library/library-page";
import ArchivePage from "./pages/archive/archive-page";
import SettingsPage from "./pages/settings/settings-page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LibraryPage />,
      },
      {
        path: "/archive",
        element: <ArchivePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
];
