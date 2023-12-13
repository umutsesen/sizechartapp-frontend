import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import { saveUserApiKey } from "/apis/user";
import { useAuthenticatedFetch } from "/hooks";

import { useEffect, useState } from "react";
/**
/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.globEager(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
export default function Routes({ pages }) {
  console.log(5)
  const routes = useRoutes(pages);
  const fetch = useAuthenticatedFetch();
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    (async () => {
      const getUserInfo = await saveUserApiKey({ fetch });
      console.log(getUserInfo, "getUserInformatıon")
      setUserInfo(getUserInfo);
    })();
  }, []);

  const routeComponents = routes.map(({ path, component: Component }) => (
    <Route key={path} path={path} element={<Component  userInfo={userInfo} setUserInfo={setUserInfo} />} />
  ));

  const NotFound = routes.find(({ path }) => path === "/notFound").component;

  return (
    <TransitionGroup>
    <CSSTransition
        key={location.pathname}
        classNames="slide"
       timeout={300}
            >
    <ReactRouterRoutes>
      {routeComponents}
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
    </CSSTransition>
    </TransitionGroup>
  );
}

function useRoutes(pages) {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace("./pages", "")
        .replace(/\.(t|j)sx?$/, "")
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, "/")
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route) => route.component);

  return routes;
}
