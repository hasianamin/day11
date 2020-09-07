import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
import {Link} from 'react-router-dom'

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" light expand="md" className="d-flex flex-lg-row flex-column justify-content-between">
            <div className="col-lg-6 col-12 d-flex justify-content-between">
                <NavbarBrand href="/" className="text-white">JSON</NavbarBrand>
                <NavbarToggler onClick={toggle} />
            </div>
            <div className="col-lg-6 col-12 d-flex justify-content-lg-end justify-content-start">
                <div>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to="/" className="text-light custom p-3">Home</Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </div>
        </Navbar>
    </div>
  );
}

export default Header;