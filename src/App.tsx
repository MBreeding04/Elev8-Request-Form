import {
  Route,
  HashRouter,
  Routes,
  useNavigate
} from "react-router-dom";
import AdminPageView from "./Components/AdminPage/AdminPageView";
import UserView from "./Components/UserView/UserView";
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<UserView></UserView>} />
        <Route path='/AdminPage' element={<AdminPageView></AdminPageView>} />
        <Route path='/FormsTable' element={<div></div>} />
      </Routes>
    </HashRouter>
  );
}
export default App;
