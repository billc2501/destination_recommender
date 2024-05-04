import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import PastResults from './pages/results';
import {Container, Navbar, Nav} from 'react-bootstrap';




const App = () => {
  return (
    <BrowserRouter>
      <Navbar expand="lg" className="bg-info">
          <Container>
            <Navbar.Brand href="/">Find Your Next Travel Location</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/results">Past Results</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
      </Navbar>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<PastResults />} />
       </Routes>
    </BrowserRouter>
 );
};


export default App;
