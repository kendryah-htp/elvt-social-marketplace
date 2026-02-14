/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminPanel from './pages/AdminPanel';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AppCatalog from './pages/AppCatalog';
import AppDetail from './pages/AppDetail';
import Home from './pages/Home';
import Join from './pages/Join';
import Onboarding from './pages/Onboarding';
import PurchaseFlow from './pages/PurchaseFlow';
import PurchaseSuccess from './pages/PurchaseSuccess';
import Storefront from './pages/Storefront';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminPanel": AdminPanel,
    "AffiliateDashboard": AffiliateDashboard,
    "AppCatalog": AppCatalog,
    "AppDetail": AppDetail,
    "Home": Home,
    "Join": Join,
    "Onboarding": Onboarding,
    "PurchaseFlow": PurchaseFlow,
    "PurchaseSuccess": PurchaseSuccess,
    "Storefront": Storefront,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};